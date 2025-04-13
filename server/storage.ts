import { users, messages, authLogs, keyRefreshLogs, messageLogs, intrusionLogs } from "@shared/schema";
import type { User, InsertUser, Message, InsertMessage, AuthLog, InsertAuthLog, KeyRefreshLog, InsertKeyRefreshLog, MessageLog, InsertMessageLog, IntrusionLog, InsertIntrusionLog } from "@shared/schema";
import { hash } from "./quantumBackend";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserStatus(id: number, isOnline: boolean): Promise<User | undefined>;
  updateUserLastActive(id: number): Promise<User | undefined>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]>;
  
  // Auth logs
  createAuthLog(log: InsertAuthLog): Promise<AuthLog>;
  getAuthLogs(): Promise<AuthLog[]>;
  
  // Key refresh logs
  createKeyRefreshLog(log: InsertKeyRefreshLog): Promise<KeyRefreshLog>;
  getKeyRefreshLogs(): Promise<KeyRefreshLog[]>;
  refreshKeys(userId: number): Promise<{ success: boolean; affectedUsers: number }>;
  
  // Message logs
  createMessageLog(log: InsertMessageLog): Promise<MessageLog>;
  getMessageLogs(): Promise<MessageLog[]>;
  
  // Intrusion logs
  createIntrusionLog(log: InsertIntrusionLog): Promise<IntrusionLog>;
  getIntrusionLogs(): Promise<IntrusionLog[]>;
  getIntrusionIncidents(): Promise<any[]>;
  
  // Admin operations
  getAdminStats(): Promise<any>;
  getRecentLogs(): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private authLogs: Map<number, AuthLog>;
  private keyRefreshLogs: Map<number, KeyRefreshLog>;
  private messageLogs: Map<number, MessageLog>;
  private intrusionLogs: Map<number, IntrusionLog>;
  
  private userIdCounter: number;
  private messageIdCounter: number;
  private authLogIdCounter: number;
  private keyRefreshLogIdCounter: number;
  private messageLogIdCounter: number;
  private intrusionLogIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.authLogs = new Map();
    this.keyRefreshLogs = new Map();
    this.messageLogs = new Map();
    this.intrusionLogs = new Map();
    
    this.userIdCounter = 1;
    this.messageIdCounter = 1;
    this.authLogIdCounter = 1;
    this.keyRefreshLogIdCounter = 1;
    this.messageLogIdCounter = 1;
    this.intrusionLogIdCounter = 1;
    
    // Initialize with admin user
    // We need to hash the password properly first
    hash("admin@1234").then(hashedPassword => {
      const adminUser = {
        id: this.userIdCounter++,
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        isAdmin: true,
        isOnline: false,
        lastActive: new Date()
      };
      this.users.set(adminUser.id, adminUser);
      console.log("Admin user created successfully");
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = {
      id,
      ...userData,
      isAdmin: false,
      isOnline: false,
      lastActive: now
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUserStatus(id: number, isOnline: boolean): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, isOnline };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserLastActive(id: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, lastActive: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Message operations
  async createMessage(messageData: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const now = new Date();
    const message: Message = {
      id,
      ...messageData,
      timestamp: now,
      isEncrypted: true
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      message => 
        (message.senderId === userId1 && message.receiverId === userId2) ||
        (message.senderId === userId2 && message.receiverId === userId1)
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Auth logs
  async createAuthLog(logData: InsertAuthLog): Promise<AuthLog> {
    const id = this.authLogIdCounter++;
    const now = new Date();
    const log: AuthLog = {
      id,
      timestamp: now,
      userId: logData.userId || null,
      action: logData.action,
      ipAddress: logData.ipAddress || null,
      userAgent: logData.userAgent || null
    };
    this.authLogs.set(id, log);
    return log;
  }

  async getAuthLogs(): Promise<AuthLog[]> {
    return Array.from(this.authLogs.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  // Key refresh logs
  async createKeyRefreshLog(logData: InsertKeyRefreshLog): Promise<KeyRefreshLog> {
    const id = this.keyRefreshLogIdCounter++;
    const now = new Date();
    const log: KeyRefreshLog = {
      id,
      timestamp: now,
      initiatedBy: logData.initiatedBy || null,
      affectedUsers: logData.affectedUsers,
      isSuccessful: logData.isSuccessful || false
    };
    this.keyRefreshLogs.set(id, log);
    return log;
  }

  async getKeyRefreshLogs(): Promise<KeyRefreshLog[]> {
    return Array.from(this.keyRefreshLogs.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  async refreshKeys(userId: number): Promise<{ success: boolean; affectedUsers: number }> {
    // In a real implementation, this would call the Python backend's API
    // for quantum key distribution
    const onlineUsers = Array.from(this.users.values()).filter(u => u.isOnline);
    return { success: true, affectedUsers: onlineUsers.length };
  }

  // Message logs
  async createMessageLog(logData: InsertMessageLog): Promise<MessageLog> {
    const id = this.messageLogIdCounter++;
    const now = new Date();
    const log: MessageLog = {
      id,
      timestamp: now,
      senderId: logData.senderId || null,
      receiverId: logData.receiverId || null,
      messageId: logData.messageId || null,
      action: logData.action
    };
    this.messageLogs.set(id, log);
    return log;
  }

  async getMessageLogs(): Promise<MessageLog[]> {
    return Array.from(this.messageLogs.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  // Intrusion logs
  async createIntrusionLog(logData: InsertIntrusionLog): Promise<IntrusionLog> {
    const id = this.intrusionLogIdCounter++;
    const now = new Date();
    const log: IntrusionLog = {
      id,
      timestamp: now,
      userId: logData.userId || null,
      ipAddress: logData.ipAddress || null,
      description: logData.description,
      severity: logData.severity,
      isResolved: false
    };
    this.intrusionLogs.set(id, log);
    return log;
  }

  async getIntrusionLogs(): Promise<IntrusionLog[]> {
    return Array.from(this.intrusionLogs.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  async getIntrusionIncidents(): Promise<any[]> {
    // Format intrusion logs for the admin panel
    const logs = await this.getIntrusionLogs();
    return logs.map(log => ({
      id: log.id,
      title: log.description.length > 30 ? log.description.slice(0, 30) + '...' : log.description,
      description: log.description,
      severity: log.severity,
      icon: log.severity === 'high' ? 'bug' : log.severity === 'medium' ? 'warning' : 'info',
      timestamp: log.timestamp,
      isResolved: log.isResolved
    }));
  }

  // Admin operations
  async getAdminStats(): Promise<any> {
    const allUsers = await this.getAllUsers();
    const activeUsers = allUsers.filter(u => u.isOnline);
    
    const allMessages = Array.from(this.messages.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const messagesToday = allMessages.filter(m => m.timestamp >= today);
    
    const keyRefreshes = await this.getKeyRefreshLogs();
    
    const intrusionAlerts = await this.getIntrusionLogs();
    const highSeverity = intrusionAlerts.filter(a => a.severity === 'high');
    const mediumSeverity = intrusionAlerts.filter(a => a.severity === 'medium');
    
    return {
      activeUsers: {
        count: activeUsers.length,
        total: allUsers.length,
        change: 12 // Mock data for demo purposes - would calculate from historical data
      },
      messages: {
        count: messagesToday.length,
        avgPerHour: Math.round(messagesToday.length / 24),
        change: 8 // Mock data for demo purposes
      },
      keyRefreshes: {
        count: keyRefreshes.length,
        lastRefresh: keyRefreshes[0]?.timestamp || null,
        status: "stable"
      },
      securityAlerts: {
        count: intrusionAlerts.length,
        high: highSeverity.length,
        medium: mediumSeverity.length,
        low: intrusionAlerts.length - highSeverity.length - mediumSeverity.length,
        change: intrusionAlerts.length > 0 ? "new" : "none"
      }
    };
  }

  async getRecentLogs(): Promise<any[]> {
    // Get various logs and combine them
    const authLogs = await this.getAuthLogs();
    const keyLogs = await this.getKeyRefreshLogs();
    const intrusions = await this.getIntrusionLogs();
    const messageLogs = await this.getMessageLogs();
    
    // Convert auth logs to common format
    const formattedAuthLogs = authLogs.slice(0, 5).map(log => ({
      id: `auth_${log.id}`,
      type: "auth",
      message: log.action === "login" 
        ? `${log.userId ? (this.users.get(log.userId)?.username || "Unknown") : "Unknown"} logged in successfully`
        : log.action === "logout"
        ? `${log.userId ? (this.users.get(log.userId)?.username || "Unknown") : "Unknown"} logged out`
        : log.action === "register"
        ? `New user registered: ${log.userId ? (this.users.get(log.userId)?.username || "Unknown") : "Unknown"}`
        : `Login failed for user ID ${log.userId}`,
      details: `via ${log.userAgent || "Unknown"} • ${log.ipAddress || "Unknown IP"}`,
      timestamp: log.timestamp
    }));
    
    // Convert key refresh logs to common format
    const formattedKeyLogs = keyLogs.slice(0, 5).map(log => ({
      id: `key_${log.id}`,
      type: "key_refresh",
      message: `Quantum key refresh for ${log.affectedUsers} active users`,
      details: `${log.initiatedBy ? (this.users.get(log.initiatedBy)?.username || "System") : "System"} • ${log.isSuccessful ? "Successful" : "Failed"}`,
      timestamp: log.timestamp
    }));
    
    // Convert intrusion logs to common format
    const formattedIntrusions = intrusions.slice(0, 5).map(log => ({
      id: `intrusion_${log.id}`,
      type: "security",
      message: log.description,
      details: `IP ${log.ipAddress || "Unknown"} • Severity: ${log.severity}`,
      timestamp: log.timestamp
    }));
    
    // Convert message logs to common format
    const formattedMessageLogs = messageLogs.slice(0, 5).map(log => ({
      id: `msg_${log.id}`,
      type: "message",
      message: `Message ${log.action} between users`,
      details: `From: ${log.senderId ? (this.users.get(log.senderId)?.username || "Unknown") : "Unknown"} To: ${log.receiverId ? (this.users.get(log.receiverId)?.username || "Unknown") : "Unknown"}`,
      timestamp: log.timestamp
    }));
    
    // Combine all logs, sort by timestamp (newest first), and take top 5
    return [...formattedAuthLogs, ...formattedKeyLogs, ...formattedIntrusions, ...formattedMessageLogs]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);
  }
}

// Export a singleton instance of the storage
export const storage = new MemStorage();
