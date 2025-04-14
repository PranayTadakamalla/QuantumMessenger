import { useEffect, useRef } from "react";
import { useChat } from "../contexts/ChatContext";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Phone, Video, Info, File, CheckCheck, Check, Shield, MessageSquare } from "lucide-react";

export default function ChatWindow({ selectedUser }) {
  const { messages, typingUsers } = useChat();
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  
  const userMessages = messages[selectedUser?.id] || [];
  const isUserTyping = selectedUser ? typingUsers[selectedUser.id] : false;
  
  // Scroll to bottom when messages change or typing status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMessages, isUserTyping]);
  
  const getInitials = (username) => {
    if (!username) return "";
    return username
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase();
  };
  
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return format(new Date(timestamp), "h:mm a");
  };
  
  return (
    <>
      {/* Chat Header */}
      <div className="px-4 py-2 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700">
              <span className="text-sm font-medium">{getInitials(selectedUser.username)}</span>
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full ${selectedUser.isOnline ? "bg-success" : "bg-gray-300"}`}></div>
          </div>
          <div className="ml-3">
            <h3 className="font-medium">{selectedUser.username}</h3>
            <div className="flex items-center text-xs text-gray-500">
              <span className="flex items-center">
                <div className={`h-1.5 w-1.5 rounded-full ${selectedUser.isOnline ? "bg-success" : "bg-gray-300"} mr-1`}></div>
                {selectedUser.isOnline ? "Online" : "Offline"}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Shield size={12} className="mr-1" />
                Quantum Encrypted
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Phone size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Video size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Info size={18} />
          </Button>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4" id="messages-container">
        {/* System Message */}
        <div className="flex justify-center">
          <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full flex items-center">
            <Shield size={12} className="mr-1" />
            <span>Quantum-secure channel established</span>
          </div>
        </div>
        
        {/* Messages */}
        {userMessages.length === 0 ? (
          <div className="flex justify-center">
            <div className="bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full flex items-center">
              <span>Start your secure conversation with {selectedUser.username}</span>
            </div>
          </div>
        ) : (
          userMessages.map((message, index) => {
            const isUserMessage = message.senderId === currentUser.id;
            
            return (
              <div key={message.id || index} className={`flex items-end ${isUserMessage ? "justify-end" : ""}`}>
                <div className={`flex flex-col space-y-0.5 max-w-xs md:max-w-md ${isUserMessage ? "items-end" : ""}`}>
                  <div className={isUserMessage 
                    ? "chat-bubble-user bg-primary-600 text-black py-2 px-3 shadow-sm" 
                    : "chat-bubble-other bg-black py-2 px-3 shadow-sm"
                  }>
                    {message.content.startsWith("FILE:") ? (
                      <div className="flex items-center">
                        <File className="h-5 w-5 mr-2" />
                        <div>
                          <p className="text-sm font-medium">{message.content.replace("FILE:", "")}</p>
                          <p className="text-xs opacity-80">Quantum Encrypted</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                  <div className={`flex items-center text-xs text-gray-500 ${isUserMessage ? "mr-2" : "ml-2"}`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {isUserMessage && (
                      message.isDelivered ? <CheckCheck size={12} className="ml-1" /> : <Check size={12} className="ml-1" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {/* Typing indicator */}
        {isUserTyping && (
          <div className="flex items-end">
            <div className="flex flex-col space-y-0.5 max-w-xs md:max-w-md">
              <div className="chat-bubble-other bg-gray-100 py-2 px-3 shadow-sm">
                <div className="flex items-center">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
              <div className="ml-2 flex items-center text-xs text-gray-500">
                <MessageSquare size={10} className="mr-1" />
                <span>{selectedUser.username} is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}
