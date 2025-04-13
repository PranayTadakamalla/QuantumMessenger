import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Shield, LayoutDashboard, Users, MessageSquare, Key, AlertTriangle, History, Settings, LogOut } from "lucide-react";

export default function AdminSidebar() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  const handleLogout = async () => {
    await logout();
  };
  
  const getInitials = (username) => {
    if (!username) return "AD";
    return username
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase();
  };
  
  const tabs = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-5 mr-2" /> },
    { id: "users", label: "Users", icon: <Users className="w-5 mr-2" /> },
    { id: "messages", label: "Messages", icon: <MessageSquare className="w-5 mr-2" /> },
    { id: "keys", label: "Key Management", icon: <Key className="w-5 mr-2" /> },
    { id: "intrusions", label: "Intrusion Detection", icon: <AlertTriangle className="w-5 mr-2" />, badge: 3 },
    { id: "logs", label: "Audit Logs", icon: <History className="w-5 mr-2" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 mr-2" /> }
  ];
  
  return (
    <div className="w-64 bg-dark text-white flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800 flex items-center">
        <div className="bg-white p-1.5 rounded-lg mr-2">
          <Shield size={16} className="text-primary-600" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg">QuantumChat</h1>
          <span className="text-xs text-gray-400">Admin Dashboard</span>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 py-4">
        <div className="px-4 mb-2 text-xs text-gray-500 uppercase font-semibold">Main</div>
        <ul>
          {tabs.slice(0, 4).map(tab => (
            <li key={tab.id}>
              <button
                className={`flex items-center w-full px-4 py-2 text-sm hover:bg-white/10 ${activeTab === tab.id ? "bg-white/5" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        
        <div className="px-4 mt-6 mb-2 text-xs text-gray-500 uppercase font-semibold">Security</div>
        <ul>
          {tabs.slice(4).map(tab => (
            <li key={tab.id}>
              <button
                className={`flex items-center w-full px-4 py-2 text-sm hover:bg-white/10 ${activeTab === tab.id ? "bg-white/5" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Info */}
      <div className="p-4 border-t border-gray-800 flex items-center">
        <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 mr-2">
          <span className="text-xs font-medium">{getInitials(currentUser?.username)}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Admin</p>
          <p className="text-xs text-gray-400">System Administrator</p>
        </div>
        <button className="text-gray-400 hover:text-white" onClick={handleLogout}>
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}
