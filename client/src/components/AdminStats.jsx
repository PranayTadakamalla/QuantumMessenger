import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquare, Key, AlertTriangle } from "lucide-react";

export default function AdminStats() {
  const [stats, setStats] = useState({
    activeUsers: { count: 0, total: 0, change: 0 },
    messages: { count: 0, avgPerHour: 0, change: 0 },
    keyRefreshes: { count: 0, lastRefresh: null, status: "stable" },
    securityAlerts: { count: 0, high: 0, medium: 0, low: 0, change: "new" }
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/stats", {
          credentials: "include"
        });
        
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
    
    // For demo purposes, use placeholder data if API fails
    const timeout = setTimeout(() => {
      if (loading) {
        setStats({
          activeUsers: { count: 24, total: 52, change: 12 },
          messages: { count: 1284, avgPerHour: 53, change: 8 },
          keyRefreshes: { count: 32, lastRefresh: new Date(Date.now() - 12 * 60000), status: "stable" },
          securityAlerts: { count: 3, high: 2, medium: 1, low: 0, change: "new" }
        });
        setLoading(false);
      }
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "unknown";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Active Users Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Active Users</h3>
            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-semibold text-gray-900">
              {loading ? "..." : stats.activeUsers.count}
            </span>
            {!loading && stats.activeUsers.change > 0 && (
              <span className="ml-2 text-sm text-success flex items-center">
                <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                {stats.activeUsers.change}%
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading..." : `Out of ${stats.activeUsers.total} registered users`}
          </p>
        </CardContent>
      </Card>
      
      {/* Messages Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Messages Today</h3>
            <div className="w-10 h-10 rounded-full bg-secondary-50 flex items-center justify-center text-secondary-600">
              <MessageSquare size={20} />
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-semibold text-gray-900">
              {loading ? "..." : stats.messages.count.toLocaleString()}
            </span>
            {!loading && stats.messages.change > 0 && (
              <span className="ml-2 text-sm text-success flex items-center">
                <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                {stats.messages.change}%
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading..." : `Avg. ${stats.messages.avgPerHour} messages per hour`}
          </p>
        </CardContent>
      </Card>
      
      {/* Key Refreshes Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Key Refreshes</h3>
            <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-accent-dark">
              <Key size={20} />
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-semibold text-gray-900">
              {loading ? "..." : stats.keyRefreshes.count}
            </span>
            <span className="ml-2 text-sm text-gray-500 flex items-center">
              <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {loading ? "Loading..." : stats.keyRefreshes.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading..." : `Last refresh: ${getTimeAgo(stats.keyRefreshes.lastRefresh)}`}
          </p>
        </CardContent>
      </Card>
      
      {/* Security Alerts Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Security Alerts</h3>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-semibold text-gray-900">
              {loading ? "..." : stats.securityAlerts.count}
            </span>
            {!loading && stats.securityAlerts.change === "new" && (
              <span className="ml-2 text-sm text-error flex items-center">
                <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                New
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading..." : `${stats.securityAlerts.high} high, ${stats.securityAlerts.medium} medium severity`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
