import { useState } from "react";
import { useChat } from "../contexts/ChatContext";
import { Input } from "@/components/ui/input";
import { useAuth } from "../contexts/AuthContext";

export default function UserList({ selectedUser, onSelectUser }) {
  const { users } = useChat();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter out the current user and admin, then apply search filter
  const filteredUsers = users
    .filter(user => user.id !== currentUser?.id && !user.isAdmin)
    .filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const getInitials = (username) => {
    if (!username) return "";
    return username
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase();
  };
  
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };
  
  return (
    <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-display font-semibold">Contacts</h2>
        <div className="mt-2 relative">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 absolute right-3 top-3 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No contacts found</p>
            {searchTerm && <p className="text-sm mt-2">Try a different search term</p>}
          </div>
        ) : (
          filteredUsers.map(user => (
            <div
              key={user.id}
              className={`flex items-center p-2 rounded-md cursor-pointer ${
                selectedUser?.id === user.id ? "bg-primary-50" : "hover:bg-gray-50"
              }`}
              onClick={() => onSelectUser(user)}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700">
                  <span className="text-sm font-medium">{getInitials(user.username)}</span>
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full ${user.isOnline ? "bg-success" : "bg-gray-300"}`}></div>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{user.username}</span>
                  <span className="text-xs text-gray-500">{getTimeAgo(user.lastActive)}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {user.lastMessage || "Start a secure conversation"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
