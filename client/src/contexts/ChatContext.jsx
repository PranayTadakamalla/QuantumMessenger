import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRefreshingKeys, setIsRefreshingKeys] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Initialize WebSocket connection
  useEffect(() => {
    if (!currentUser) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);

      // Send authentication message
      newSocket.send(JSON.stringify({
        type: "auth",
        userId: currentUser.id,
        username: currentUser.username
      }));
    };

    newSocket.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the chat server",
        variant: "destructive",
      });
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case "users":
          setUsers(data.users);
          break;
        
        case "message":
          receiveMessage(data);
          break;
        
        case "user_status":
          updateUserStatus(data);
          break;
        
        case "key_refresh":
          handleKeyRefresh(data);
          break;
          
        default:
          console.log("Unknown message type:", data.type);
      }
    };

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [currentUser]);

  // Fetch all users
  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users", {
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Fetch messages for selected user
  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${selectedUser.id}`, {
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          
          setMessages(prev => ({
            ...prev,
            [selectedUser.id]: data.messages
          }));
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [currentUser, selectedUser]);

  const sendMessage = useCallback((content) => {
    if (!socket || !selectedUser || socket.readyState !== WebSocket.OPEN) {
      toast({
        title: "Cannot send message",
        description: "Connection to the server is not established",
        variant: "destructive",
      });
      return;
    }

    const message = {
      type: "message",
      content,
      receiverId: selectedUser.id,
      senderId: currentUser.id,
      timestamp: new Date().toISOString()
    };

    socket.send(JSON.stringify(message));

    // Optimistically add to messages
    const newMessage = {
      ...message,
      id: Date.now(), // Temporary ID
      sender: currentUser,
      receiver: selectedUser
    };

    setMessages(prev => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage]
    }));
  }, [socket, selectedUser, currentUser, toast]);

  const receiveMessage = useCallback((data) => {
    const { senderId, message } = data;
    
    setMessages(prev => {
      const userMessages = prev[senderId] || [];
      
      // Check if this is a new message
      if (!userMessages.some(m => m.id === message.id)) {
        return {
          ...prev,
          [senderId]: [...userMessages, message]
        };
      }
      
      return prev;
    });
    
    // If message is from someone other than currently selected user, show notification
    if (selectedUser?.id !== senderId) {
      const sender = users.find(u => u.id === senderId);
      
      if (sender) {
        toast({
          title: `New message from ${sender.username}`,
          description: message.content,
        });
      }
    }
  }, [selectedUser, users, toast]);

  const updateUserStatus = useCallback((data) => {
    const { userId, status } = data;
    
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, isOnline: status === "online" } : user
      )
    );
  }, []);

  const refreshKeys = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setIsRefreshingKeys(true);
      
      const res = await fetch("/api/keys/refresh", {
        method: "POST",
        credentials: "include",
      });
      
      if (res.ok) {
        toast({
          title: "Key Refresh Successful",
          description: "Your quantum encryption keys have been updated",
        });
      } else {
        throw new Error("Failed to refresh keys");
      }
    } catch (error) {
      toast({
        title: "Key Refresh Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRefreshingKeys(false);
    }
  }, [currentUser, toast]);

  const handleKeyRefresh = useCallback((data) => {
    toast({
      title: "Quantum Keys Updated",
      description: `Your encryption keys were refreshed${data.initiatedBy ? ` by ${data.initiatedBy}` : ''}`,
    });
  }, [toast]);

  const value = {
    users,
    messages,
    selectedUser,
    setSelectedUser,
    connected,
    sendMessage,
    refreshKeys,
    isRefreshingKeys
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
