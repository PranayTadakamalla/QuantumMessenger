import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import AdminDashboard from "../components/AdminDashboard";

export default function Admin() {
  const { currentUser, loading, isAuthenticated, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  
  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated, isAdmin, setLocation]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="h-screen flex">
      <AdminSidebar />
      <AdminDashboard />
    </div>
  );
}
