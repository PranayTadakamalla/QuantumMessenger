import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Key } from "lucide-react";

export default function KeyRefreshModal() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Quantum Key Refresh</CardTitle>
        </CardHeader>
        
        <CardContent className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4 animate-pulse">
            <Key size={32} />
          </div>
          <h4 className="text-xl font-medium mb-3">Refreshing Quantum Keys</h4>
          <p className="text-gray-600 mb-6">
            This will generate new quantum-secure keys for all your active conversations. 
            This process is secure and won't interrupt your current conversations.
          </p>
          
          <Progress value={66} className="h-2.5 mb-6" />
          
          <p className="text-sm text-gray-500">Establishing quantum channel...</p>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" disabled>
            Cancel
          </Button>
          <Button disabled>
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
