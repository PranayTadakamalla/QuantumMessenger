import { Express } from "express";
import { storage } from "./storage";
import { hash, compare } from "./quantumBackend";
import { z } from "zod";
import { insertUserSchema } from "../shared/schema";
import expressSession from "express-session";
import MemoryStore from "memorystore";

// Extended user schema with validation for registration
const registerSchema = insertUserSchema.extend({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
});

// Login schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

export function setupAuthRoutes(app: Express) {
  // Setup session middleware
  const MemorySessionStore = MemoryStore(expressSession);
  
  app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'quantum-secure-chat-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    store: new MemorySessionStore({
      checkPeriod: 86400000 // 24 hours
    })
  }));
  
  // Register route
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Validate input
      const validatedData = registerSchema.parse(req.body);
      
      // Check if username already exists
      const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Hash password using quantum-secure method
      const hashedPassword = await hash(validatedData.password);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword
      });
      
      // Log registration
      await storage.createAuthLog({
        userId: user.id,
        action: "register",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
      });
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({
        message: "User registered successfully",
        user: userWithoutPassword
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });
  
  // Login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      // Validate input
      const validatedData = loginSchema.parse(req.body);
      
      // Find user by username
      const user = await storage.getUserByUsername(validatedData.username);
      if (!user) {
        // Log failed login attempt
        await storage.createAuthLog({
          userId: null,
          action: "failed_login",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"]
        });
        
        // Create intrusion log for multiple failed attempts
        // In a real implementation, we would check for repeated failures
        // from the same IP before logging an intrusion
        await storage.createIntrusionLog({
          userId: null,
          ipAddress: req.ip,
          description: `Failed login attempt for username: ${validatedData.username}`,
          severity: "low"
        });
        
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Verify password
      const passwordValid = await compare(validatedData.password, user.password);
      if (!passwordValid) {
        // Log failed login attempt
        await storage.createAuthLog({
          userId: user.id,
          action: "failed_login",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"]
        });
        
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Update user status to online
      await storage.updateUserStatus(user.id, true);
      
      // Update last active time
      await storage.updateUserLastActive(user.id);
      
      // Set user in session
      req.session.userId = user.id;
      
      // Log successful login
      await storage.createAuthLog({
        userId: user.id,
        action: "login",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
      });
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      
      res.json({
        message: "Login successful",
        user: userWithoutPassword
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Logout route
  app.post("/api/auth/logout", async (req, res) => {
    try {
      const userId = req.session?.userId;
      
      if (userId) {
        // Update user status to offline
        await storage.updateUserStatus(userId, false);
        
        // Log logout
        await storage.createAuthLog({
          userId,
          action: "logout",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"]
        });
      }
      
      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({ message: "Logout failed" });
        }
        
        res.json({ message: "Logout successful" });
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });
}
