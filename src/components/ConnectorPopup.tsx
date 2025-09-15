import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Database,
  Wifi,
  Activity,
  CheckCircle2
} from "lucide-react";

export const ConnectorPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 bg-success-subtle text-success border-success/20 hover:bg-success/10"
        >
          <Database className="h-4 w-4" />
          <span className="hidden sm:inline">Informatica</span>
          <Badge variant="secondary" className="bg-success text-success-foreground px-1.5 py-0.5 text-xs">
            Connected
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Informatica Integration
          </DialogTitle>
          <DialogDescription>
            Real-time MDM data connector status and metrics
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 bg-success-subtle rounded-lg border border-success/20">
            <div className="flex items-center gap-3">
              <Wifi className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium text-success">Connected</p>
                <p className="text-sm text-success/80">Informatica API Active</p>
              </div>
            </div>
            <Badge className="bg-success text-success-foreground">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Live Requests</span>
              </div>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Success Rate</span>
              </div>
              <div className="text-2xl font-bold">98.7%</div>
              <p className="text-xs text-muted-foreground">Last 24h</p>
            </div>
          </div>

          {/* Connection Info */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Endpoint:</span>
                <span className="font-mono">api.informatica.com/v1/stewardship</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Connection Type:</span>
                <span>Real-time Stream</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Sync:</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};