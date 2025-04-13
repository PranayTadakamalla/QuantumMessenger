import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupWebSocketServer } from "./socket";
import { setupAuthRoutes } from "./auth";
import { setupQuantumBackend } from "./quantumBackend";
import { z } from "zod";
import { insertUserSchema, insertAuthLogSchema, insertKeyRefreshLogSchema, insertIntrusionLogSchema } from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup WebSocket server for real-time communication
  setupWebSocketServer(httpServer);
  
  // Auth routes for registration, login, and logout
  setupAuthRoutes(app);
  
  // Connect to Python quantum backend
  setupQuantumBackend();
  
  // User routes
  app.get("/api/auth/status", async (req, res) => {
    // Check if user is authenticated via session
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      // Don't send password to client
      const { password, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error) {
      console.error("Error checking auth status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all users (excluding current user and excluding password)
  app.get("/api/users", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const allUsers = await storage.getAllUsers();
      const filteredUsers = allUsers.map(user => {
        // Remove password from user data
        const { password, ...safeUser } = user;
        return safeUser;
      });
      
      res.json({ users: filteredUsers });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get messages between users
  app.get("/api/messages/:userId", async (req, res) => {
    const currentUserId = req.session?.userId;
    if (!currentUserId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const otherUserId = parseInt(req.params.userId);
    if (isNaN(otherUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
      const messages = await storage.getMessagesBetweenUsers(currentUserId, otherUserId);
      res.json({ messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Refresh quantum keys
  app.post("/api/keys/refresh", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      // Call the quantum backend for key refresh
      const result = await storage.refreshKeys(userId);
      
      // Log the key refresh
      const keyRefreshLog: z.infer<typeof insertKeyRefreshLogSchema> = {
        initiatedBy: userId,
        affectedUsers: result.affectedUsers,
        isSuccessful: result.success
      };
      await storage.createKeyRefreshLog(keyRefreshLog);
      
      res.json({ success: true, message: "Keys refreshed successfully" });
    } catch (error) {
      console.error("Error refreshing keys:", error);
      res.status(500).json({ message: "Failed to refresh keys" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const users = await storage.getAllUsers();
      // Remove passwords before sending to client
      const safeUsers = users.map(user => {
        const { password, ...safeUser } = user;
        return {
          ...safeUser,
          keyStatus: "active" // Mock data - would come from quantum backend
        };
      });
      
      res.json({ users: safeUsers });
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/logs/recent", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const logs = await storage.getRecentLogs();
      res.json({ logs });
    } catch (error) {
      console.error("Error fetching recent logs:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/intrusions", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const incidents = await storage.getIntrusionIncidents();
      res.json({ incidents });
    } catch (error) {
      console.error("Error fetching intrusion incidents:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
