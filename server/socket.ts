import WebSocket, { WebSocketServer } from 'ws';
import { Server } from 'http';
import { storage } from './storage';
import { encryptMessage, decryptMessage } from './quantumBackend';

// Define message types
interface BaseMessage {
  type: string;
}

interface AuthMessage extends BaseMessage {
  type: 'auth';
  userId: number;
  username: string;
}

interface ChatMessage extends BaseMessage {
  type: 'message';
  content: string;
  senderId: number;
  receiverId: number;
  timestamp: string;
}

interface StatusMessage extends BaseMessage {
  type: 'user_status';
  userId: number;
  status: 'online' | 'offline';
}

interface KeyRefreshMessage extends BaseMessage {
  type: 'key_refresh';
  initiatedBy: string | null;
}

interface AdminDataUpdateMessage extends BaseMessage {
  type: 'admin_data_update';
  dataType: 'stats' | 'users' | 'logs' | 'intrusions';
  timestamp: string;
}

// Map to store connected clients and their user IDs
const clients = new Map<WebSocket, number>();

export function setupWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    
    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'auth':
            handleAuthentication(ws, data as AuthMessage);
            break;
            
          case 'message':
            await handleChatMessage(ws, data as ChatMessage);
            break;
            
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      // Update user status when they disconnect
      const userId = clients.get(ws);
      if (userId) {
        updateUserStatus(userId, false);
        clients.delete(ws);
      }
      console.log('WebSocket client disconnected');
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
  
  return wss;
}

async function handleAuthentication(ws: WebSocket, data: AuthMessage) {
  const { userId, username } = data;
  
  // Store client connection with associated user ID
  clients.set(ws, userId);
  
  // Update user status to online
  await updateUserStatus(userId, true);
  
  // Update last active time
  await storage.updateUserLastActive(userId);
  
  // Send all users to the client
  sendUsersList(ws);
}

async function handleChatMessage(ws: WebSocket, data: ChatMessage) {
  const { content, senderId, receiverId, timestamp } = data;
  
  // Verify the sender is the authenticated user
  const authenticatedUserId = clients.get(ws);
  if (authenticatedUserId !== senderId) {
    console.warn('Message sender ID does not match authenticated user');
    return;
  }
  
  try {
    // Encrypt the message content using quantum backend
    const encryptedContent = await encryptMessage(content);
    
    // Store message in database
    const message = await storage.createMessage({
      content: encryptedContent,
      senderId,
      receiverId
    });
    
    // Create message log
    await storage.createMessageLog({
      messageId: message.id,
      senderId,
      receiverId,
      action: 'sent'
    });
    
    // Update sender's last active time
    await storage.updateUserLastActive(senderId);
    
    // Find the receiver's WebSocket if they're online
    const receiverWs = findClientByUserId(receiverId);
    
    if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
      // Decrypt the message for sending (in reality, this would be done on the client side)
      const decryptedContent = await decryptMessage(encryptedContent);
      
      // Send message to receiver
      const messageToSend = {
        type: 'message',
        senderId,
        message: {
          id: message.id,
          content: decryptedContent,
          senderId,
          receiverId,
          timestamp: message.timestamp,
          isEncrypted: true
        }
      };
      
      receiverWs.send(JSON.stringify(messageToSend));
      
      // Update message log to delivered
      await storage.createMessageLog({
        messageId: message.id,
        senderId,
        receiverId,
        action: 'delivered'
      });
    }
  } catch (error) {
    console.error('Error handling chat message:', error);
  }
}

// Find a client WebSocket by user ID
function findClientByUserId(userId: number): WebSocket | undefined {
  for (const [ws, id] of clients.entries()) {
    if (id === userId) {
      return ws;
    }
  }
  return undefined;
}

// Update user's online status
async function updateUserStatus(userId: number, isOnline: boolean) {
  try {
    const updatedUser = await storage.updateUserStatus(userId, isOnline);
    
    if (!updatedUser) {
      console.warn(`User with ID ${userId} not found when updating status`);
      return;
    }
    
    // Broadcast status change to all clients
    const statusUpdate: StatusMessage = {
      type: 'user_status',
      userId,
      status: isOnline ? 'online' : 'offline'
    };
    
    broadcastToAllClients(statusUpdate);
  } catch (error) {
    console.error('Error updating user status:', error);
  }
}

// Send the list of users to a client
async function sendUsersList(ws: WebSocket) {
  try {
    const allUsers = await storage.getAllUsers();
    
    // Remove sensitive data before sending
    const safeUsers = allUsers.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    
    ws.send(JSON.stringify({
      type: 'users',
      users: safeUsers
    }));
  } catch (error) {
    console.error('Error sending users list:', error);
  }
}

// Broadcast a message to all connected clients
function broadcastToAllClients(message: any) {
  const messageStr = JSON.stringify(message);
  
  clients.forEach((userId, ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(messageStr);
    }
  });
}

// Broadcast key refresh notification
export async function broadcastKeyRefresh(initiatedBy: string | null) {
  const message: KeyRefreshMessage = {
    type: 'key_refresh',
    initiatedBy
  };
  
  broadcastToAllClients(message);
}

// Broadcast admin data updates to all admin users
export async function broadcastAdminDataUpdate(dataType: 'stats' | 'users' | 'logs' | 'intrusions') {
  const message: AdminDataUpdateMessage = {
    type: 'admin_data_update',
    dataType,
    timestamp: new Date().toISOString()
  };
  
  // Find all admin users and send them the update
  try {
    const allUsers = await storage.getAllUsers();
    const adminUsers = allUsers.filter(user => user.isAdmin);
    
    // For each admin user, find their connection and send the update
    for (const adminUser of adminUsers) {
      const adminWs = findClientByUserId(adminUser.id);
      if (adminWs && adminWs.readyState === WebSocket.OPEN) {
        adminWs.send(JSON.stringify(message));
      }
    }
  } catch (error) {
    console.error('Error broadcasting admin data update:', error);
  }
}

// Broadcast to admin clients only
export function broadcastToAdminClients(message: any) {
  const messageStr = JSON.stringify(message);
  
  storage.getAllUsers().then(users => {
    const adminIds = users.filter(user => user.isAdmin).map(admin => admin.id);
    
    clients.forEach((userId, ws) => {
      if (ws.readyState === WebSocket.OPEN && adminIds.includes(userId)) {
        ws.send(messageStr);
      }
    });
  }).catch(error => {
    console.error('Error broadcasting to admin clients:', error);
  });
}
