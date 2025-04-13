import { useState, useEffect } from "react";
import AdminStats from "./AdminStats";
import AdminUserList from "./AdminUserList";
import AdminLogs from "./AdminLogs";
import AdminIntrusions from "./AdminIntrusions";
import { DownloadCloud, Bell, Settings, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("overview");
  
  return (
    <div className="flex-1 bg-gray-100 overflow-y-auto">
      {/* Top Bar */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h2 className="font-display font-semibold text-xl">Dashboard Overview</h2>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Bell size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Settings size={18} />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <Button size="sm" className="flex items-center">
            <DownloadCloud size={16} className="mr-1" /> Export Data
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
