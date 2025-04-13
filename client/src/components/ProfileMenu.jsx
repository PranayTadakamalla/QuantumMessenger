import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Settings, Shield, LogOut } from "lucide-react";

export default function ProfileMenu({ user }) {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  if (!user) return null;
  
  const getInitials = (username) => {
    if (!username) return "";
    return username
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase();
  };
  
  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
            <span className="text-sm font-medium">{getInitials(user.username)}</span>
          </div>
          <span className="text-sm font-medium">{user.username}</span>
          <ChevronDown size={14} className="text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <Settings size={14} className="mr-2" />
          <span>Profile Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Shield size={14} className="mr-2" />
          <span>Security</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut size={14} className="mr-2" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
