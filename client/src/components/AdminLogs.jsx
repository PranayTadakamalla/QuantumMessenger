import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw, AlertTriangle, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
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
      setIsRefreshing(false);
    }
  };
  
  // Function to manually refresh logs
  const refreshLogs = () => {
    setIsRefreshing(true);
    fetchLogs().then(() => {
      toast({
        title: "Logs refreshed",
        description: "Activity logs have been updated with the latest data",
        variant: "default",
      });
    });
  };
  
  useEffect(() => {
    fetchLogs();
    
    // Setup interval for real-time updates
    const refreshInterval = setInterval(fetchLogs, 30000); // refresh every 30 seconds
    
    return () => clearInterval(refreshInterval);
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
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={refreshLogs} 
            disabled={isRefreshing}
            className={`text-gray-600 hover:text-accent-main ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={16} />
          </Button>
          <Button variant="link" size="sm">View All</Button>
        </div>
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
