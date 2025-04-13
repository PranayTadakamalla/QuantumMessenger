import { useChat } from "../contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function KeyRefreshButton() {
  const { refreshKeys, isRefreshingKeys } = useChat();
  
  return (
    <Button 
      variant="ghost" 
      size="sm"
      className="flex items-center mr-4 px-3 py-1.5 text-xs bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100"
      onClick={refreshKeys}
      disabled={isRefreshingKeys}
    >
      <RefreshCw size={12} className="mr-1.5" />
      <span>Refresh Keys</span>
    </Button>
  );
}
