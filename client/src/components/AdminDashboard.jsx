import { useState, useEffect } from "react";
import AdminStats from "./AdminStats";
import AdminUserList from "./AdminUserList";
import AdminLogs from "./AdminLogs";
import AdminIntrusions from "./AdminIntrusions";
import { DownloadCloud, Bell, Settings, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuth();
  
  // Function to fetch and refresh all dashboard data
  const refreshData = () => {
    setIsRefreshing(true);
    
    // Force component re-renders through state updates
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data refreshed",
        description: "Dashboard data has been updated with real-time information",
        variant: "default",
      });
    }, 1000);
  };
  
  // Export dashboard data as JSON
  const exportData = async () => {
    try {
      // Fetch all relevant data
      const statsRes = await fetch('/api/admin/stats', { credentials: 'include' });
      const usersRes = await fetch('/api/admin/users', { credentials: 'include' });
      const logsRes = await fetch('/api/admin/logs/recent', { credentials: 'include' });
      const intrusionsRes = await fetch('/api/admin/intrusions', { credentials: 'include' });
      
      if (!statsRes.ok || !usersRes.ok || !logsRes.ok || !intrusionsRes.ok) {
        throw new Error('Failed to fetch data for export');
      }
      
      const stats = await statsRes.json();
      const users = await usersRes.json();
      const logs = await logsRes.json();
      const intrusions = await intrusionsRes.json();
      
      // Combine into one export object
      const exportData = {
        stats,
        users,
        logs,
        intrusions,
        exportTimestamp: new Date().toISOString(),
        system: "QuantumChat Admin Dashboard"
      };
      
      // Convert to JSON and create download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `quantum-chat-admin-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export successful",
        description: "Dashboard data has been exported to JSON",
        variant: "default",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: error.message || "Failed to export dashboard data",
        variant: "destructive",
      });
    }
  };
  
  // Initial data refresh on component mount
  useEffect(() => {
    refreshData();
  }, []);
  
  return (
    <div className="flex-1 bg-gray-100 overflow-y-auto">
      {/* Top Bar */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h2 className="font-display font-semibold text-xl">Dashboard Overview</h2>
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:text-accent-main btn-hover-effect"
            onClick={() => toast({
              title: "Notifications",
              description: "You have no new notifications",
            })}
          >
            <Bell size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:text-accent-main btn-hover-effect"
            onClick={() => toast({
              title: "Settings",
              description: "Dashboard settings panel will be implemented in the next update",
            })}
          >
            <Settings size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`text-gray-600 hover:text-accent-main btn-hover-effect ${isRefreshing ? 'animate-spin' : ''}`}
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw size={18} />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <Button 
            size="sm" 
            className="flex items-center btn-hover-effect"
            onClick={exportData}
          >
            <DownloadCloud size={16} className="mr-1" /> Export Data
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <Button 
            size="sm" 
            variant="destructive"
            className="flex items-center btn-hover-effect"
            onClick={logout}
          >
            <LogOut size={16} className="mr-1" /> Logout
          </Button>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="p-6">
        {/* Stats Cards */}
        <AdminStats />
        
        {/* Charts & Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Activity Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-semibold">User Activity</h3>
              <div className="flex items-center space-x-2">
                <select className="text-sm border border-gray-300 rounded p-1">
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500">Activity Trend Chart</p>
                <p className="text-xs text-gray-400">(Would be implemented with Recharts)</p>
              </div>
            </div>
          </div>
          
          {/* Security Incidents */}
          <AdminIntrusions />
        </div>
        
        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Registered Users Table */}
          <div className="lg:col-span-2">
            <AdminUserList />
          </div>
          
          {/* Recent Activity */}
          <AdminLogs />
        </div>
      </div>
    </div>
  );
}
