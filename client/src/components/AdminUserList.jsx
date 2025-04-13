import { useState, useEffect } from "react";
import { apiRequest } from "../lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Eye, Key, MoreVertical } from "lucide-react";

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/users", {
          credentials: "include"
        });
        
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
    if (!timestamp) return "Never";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    
    if (diffMs < 60000) return "Just now";
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };
  
  return (
    <Card>
      <CardHeader className="flex-row flex items-center justify-between">
        <CardTitle>Registered Users</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search users..."
              className="pl-8 pr-3 py-1.5 w-48 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2 text-gray-400 h-4 w-4" />
          </div>
          <Button variant="outline" size="icon" className="p-1.5">
            <Filter className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3 rounded-tl-lg">User</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Key State</th>
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">No users found</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 mr-3">
                        <span className="text-xs font-medium">{getInitials(user.username)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${user.isOnline ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {user.isOnline ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${user.keyStatus === "active" ? "bg-success" : user.keyStatus === "needs_refresh" ? "text-amber-500" : "bg-gray-400"} mr-1.5`}></div>
                        <span>{user.keyStatus === "active" ? "Active" : user.keyStatus === "needs_refresh" ? "Needs Refresh" : "Inactive"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      <span>{getTimeAgo(user.lastActive)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="text-gray-500">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-500">
                          <Key size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-500">
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex space-x-1">
            <Button variant="outline" size="sm" className="text-sm">Previous</Button>
            <Button variant="outline" size="sm" className="text-sm bg-primary-50 text-primary-700 font-medium">1</Button>
            <Button variant="outline" size="sm" className="text-sm">2</Button>
            <Button variant="outline" size="sm" className="text-sm">3</Button>
            <Button variant="outline" size="sm" className="text-sm">Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
