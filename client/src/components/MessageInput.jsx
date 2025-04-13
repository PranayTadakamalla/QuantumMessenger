import { useState } from "react";
import { useChat } from "../contexts/ChatContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Shield } from "lucide-react";

export default function MessageInput({ selectedUser }) {
  const [message, setMessage] = useState("");
  const { sendMessage, connected } = useChat();
  const { currentUser } = useAuth();
  
  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser || !currentUser || !connected) return;
    
    sendMessage(message.trim());
    setMessage("");
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="p-3 bg-white border-t border-gray-200">
      <div className="flex items-end space-x-2">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Paperclip size={18} />
        </Button>
        <div className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500">
          <Textarea
            rows={1}
            placeholder="Type a quantum-secured message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full focus:outline-none resize-none text-sm min-h-[40px] max-h-[120px]"
            disabled={!connected}
          />
        </div>
        <Button 
          onClick={handleSendMessage}
          disabled={!message.trim() || !connected}
          size="icon" 
          className="rounded-full"
        >
          <Send size={18} />
        </Button>
      </div>
      <div className="flex items-center mt-2 text-xs text-gray-500 px-2">
        <Shield size={12} className="mr-1" />
        <span>End-to-end quantum encryption active</span>
      </div>
    </div>
  );
}
