import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bug, AlertTriangle, Info } from "lucide-react";

export default function AdminIntrusions() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/intrusions", {
          credentials: "include"
        });
        
        if (res.ok) {
          const data = await res.json();
          setIncidents(data.incidents || []);
        }
      } catch (error) {
        console.error("Failed to fetch intrusion data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIncidents();
    
    // For demo purposes, use placeholder data if API fails
    const timeout = setTimeout(() => {
      if (loading) {
        setIncidents([
          {
            id: 1,
            title: "Potential Brute Force Attack",
            description: "Multiple failed login attempts from IP 192.168.1.145",
            severity: "high",
            icon: "bug",
            timestamp: new Date(Date.now() - 30 * 60000),
          },
          {
            id: 2,
            title: "Unusual Access Pattern",
            description: "User 'bob.johnson' accessing messages outside normal hours",
            severity: "medium",
            icon: "warning",
            timestamp: new Date(Date.now() - 2 * 60 * 60000),
          },
          {
            id: 3,
            title: "Key Distribution Delay",
            description: "Slight delay in quantum key distribution to 3 users",
            severity: "low",
            icon: "info",
            timestamp: new Date(Date.now() - 5 * 60 * 60000),
          }
        ]);
        setLoading(false);
      }
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };
  
  const getIncidentIcon = (icon, severity) => {
    switch (icon) {
      case "bug":
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-3">
            <Bug size={16} />
          </div>
        );
      case "warning":
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mr-3">
            <AlertTriangle size={16} />
          </div>
        );
      case "info":
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
            <Info size={16} />
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 mr-3">
            <AlertTriangle size={16} />
          </div>
        );
    }
  };
  
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "high":
        return {
          background: "bg-red-50",
          border: "border-red-500",
          badge: "bg-red-100 text-red-800"
        };
      case "medium":
        return {
          background: "bg-yellow-50",
          border: "border-yellow-500",
          badge: "bg-yellow-100 text-yellow-800"
        };
      case "low":
        return {
          background: "bg-blue-50",
          border: "border-blue-500",
          badge: "bg-blue-100 text-blue-800"
        };
      default:
        return {
          background: "bg-gray-50",
          border: "border-gray-500",
          badge: "bg-gray-100 text-gray-800"
        };
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex-row flex items-center justify-between">
        <CardTitle>Security Incidents</CardTitle>
        <Button variant="link" size="sm">View All</Button>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading security incidents...</div>
          ) : incidents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No security incidents</div>
          ) : (
            incidents.map(incident => {
              const style = getSeverityStyle(incident.severity);
              
              return (
                <div key={incident.id} className={`p-3 ${style.background} border-l-4 ${style.border} rounded`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getIncidentIcon(incident.icon, incident.severity)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{incident.title}</p>
                        <p className="text-xs text-gray-500">{incident.description}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
                      {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">{getTimeAgo(incident.timestamp)}</span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">Investigate</Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className={incident.severity === "high" ? "" : "bg-gray-600 hover:bg-gray-700"}
                      >
                        {incident.severity === "high" ? "Block IP" : "Notify User"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
