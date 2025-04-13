import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  isOnline: boolean("is_online").default(false).notNull(),
  lastActive: timestamp("last_active").defaultNow().notNull()
});

// Message model
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isEncrypted: boolean("is_encrypted").default(true).notNull()
});

// Authentication logs
export const authLogs = pgTable("auth_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(), // "login", "logout", "register", "failed_login"
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

// Key refresh logs
export const keyRefreshLogs = pgTable("key_refresh_logs", {
  id: serial("id").primaryKey(),
  initiatedBy: integer("initiated_by").references(() => users.id),
  affectedUsers: integer("affected_users").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isSuccessful: boolean("is_successful").default(true).notNull()
});

// Message logs for admin 
export const messageLogs = pgTable("message_logs", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").references(() => messages.id),
  senderId: integer("sender_id").references(() => users.id),
  receiverId: integer("receiver_id").references(() => users.id),
  action: text("action").notNull(), // "sent", "delivered", "read"
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

// Intrusion detection logs
export const intrusionLogs = pgTable("intrusion_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  ipAddress: text("ip_address"),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // "low", "medium", "high"
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isResolved: boolean("is_resolved").default(false).notNull()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  content: true,
  senderId: true,
  receiverId: true,
});

export const insertAuthLogSchema = createInsertSchema(authLogs).pick({
  userId: true,
  action: true,
  ipAddress: true,
  userAgent: true,
});

export const insertKeyRefreshLogSchema = createInsertSchema(keyRefreshLogs).pick({
  initiatedBy: true,
  affectedUsers: true,
  isSuccessful: true,
});

export const insertMessageLogSchema = createInsertSchema(messageLogs).pick({
  messageId: true,
  senderId: true,
  receiverId: true,
  action: true,
});

export const insertIntrusionLogSchema = createInsertSchema(intrusionLogs).pick({
  userId: true,
  ipAddress: true,
  description: true,
  severity: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type AuthLog = typeof authLogs.$inferSelect;
export type InsertAuthLog = z.infer<typeof insertAuthLogSchema>;

export type KeyRefreshLog = typeof keyRefreshLogs.$inferSelect;
export type InsertKeyRefreshLog = z.infer<typeof insertKeyRefreshLogSchema>;

export type MessageLog = typeof messageLogs.$inferSelect;
export type InsertMessageLog = z.infer<typeof insertMessageLogSchema>;

export type IntrusionLog = typeof intrusionLogs.$inferSelect;
export type InsertIntrusionLog = z.infer<typeof insertIntrusionLogSchema>;
