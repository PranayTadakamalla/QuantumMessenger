import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw, AlertTriangle, MessageCircle } from "lucide-react";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/logs/recent", {
          credentials: "include"
        });
        
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
    
    // For demo purposes, use placeholder data if API fails
    const timeout = setTimeout(() => {
      if (loading) {
        setLogs([
          { 
            id: 1, 
            type: "auth", 
            message: "Alice Smith logged in successfully", 
            details: "via Web Client • 192.168.1.32", 
            timestamp: new Date(Date.now() - 5 * 60000) 
          },
          { 
            id: 2, 
            type: "key_refresh", 
            message: "Quantum key refresh for 24 active users", 
            details: "Scheduled • BB84 Protocol", 
            timestamp: new Date(Date.now() - 30 * 60000) 
          },
          { 
            id: 3, 
            type: "security", 
            message: "Multiple failed login attempts detected", 
            details: "IP 192.168.1.145 • User 'admin'", 
            timestamp: new Date(Date.now() - 48 * 60000) 
          },
          { 
            id: 4, 
            type: "message", 
            message: "High message volume between users", 
            details: "253 messages in last 15 minutes", 
            timestamp: new Date(Date.now() - 75 * 60000) 
          },
          { 
            id: 5, 
            type: "auth", 
            message: "Bob Johnson logged in successfully", 
            details: "via Mobile App • 192.168.1.105", 
            timestamp: new Date(Date.now() - 90 * 60000) 
          }
        ]);
        setLoading(false);
      }
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getLogIcon = (type) => {
    switch (type) {
      case "auth":
        return <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-success"></div>;
      case "key_refresh":
        return <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary-600"></div>;
      case "security":
        return <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-error"></div>;
      case "message":
        return <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-secondary-500"></div>;
      default:
        return <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-gray-400"></div>;
    }
  };
  
  const getLogTitle = (type) => {
    switch (type) {
      case "auth": return "User Authentication";
      case "key_refresh": return "Key Refresh";
      case "security": return "Security Alert";
      case "message": return "Message Traffic";
      default: return "System Event";
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex-row flex items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="link" size="sm">View All</Button>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading activity logs...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No recent activity</div>
          ) : (
            logs.map((log, index) => (
              <div 
                key={log.id} 
                className={`relative pl-6 ${
                  index < logs.length - 1 ? "pb-6 border-l-2 border-gray-200" : ""
                }`}
              >
                {getLogIcon(log.type)}
                <div className="mb-1">
                  <span className="text-sm font-medium">{getLogTitle(log.type)}</span>
                  <span className="text-xs text-gray-500 ml-2">{formatTime(log.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-600">{log.message}</p>
                <span className="text-xs text-gray-500">{log.details}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
