import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Wifi, 
  WifiOff, 
  Activity, 
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";

interface StreamingRequest {
  id: string;
  npi: string;
  type: string;
  status: "pending" | "processing" | "completed";
  timestamp: string;
  source: "informatica";
}

export const InformaticaIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [streamingRequests, setStreamingRequests] = useState<StreamingRequest[]>([]);
  const { toast } = useToast();

  // Simulate live streaming data when connected
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      const newRequest: StreamingRequest = {
        id: `req_${Date.now()}`,
        npi: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        type: ["specialty_update", "license_verification", "address_update"][Math.floor(Math.random() * 3)],
        status: "pending",
        timestamp: new Date().toISOString(),
        source: "informatica"
      };

      setStreamingRequests(prev => [newRequest, ...prev.slice(0, 9)]);

      // Simulate status progression
      setTimeout(() => {
        setStreamingRequests(prev => prev.map(req => 
          req.id === newRequest.id 
            ? { ...req, status: "processing" as const }
            : req
        ));
      }, 2000);

      setTimeout(() => {
        setStreamingRequests(prev => prev.map(req => 
          req.id === newRequest.id 
            ? { ...req, status: "completed" as const }
            : req
        ));
      }, 5000);
    }, 8000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const handleConnect = async () => {
    if (!apiEndpoint || !apiKey) {
      toast({
        title: "Missing Configuration",
        description: "Please provide both API endpoint and API key",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    // Simulate API connection
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      toast({
        title: "Connected Successfully",
        description: "Informatica API integration is now active",
      });
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setStreamingRequests([]);
    toast({
      title: "Disconnected",
      description: "Informatica API integration has been disabled",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "processing":
        return <RefreshCw className="h-4 w-4 text-primary animate-spin" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      default:
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning-subtle text-warning border-warning/20";
      case "processing":
        return "bg-primary-subtle text-primary border-primary/20";
      case "completed":
        return "bg-success-subtle text-success border-success/20";
      default:
        return "bg-destructive-subtle text-destructive border-destructive/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Informatica API Integration
          </CardTitle>
          <CardDescription>
            Connect to Informatica API for real-time stewardship request streaming
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="h-5 w-5 text-success" />
              ) : (
                <WifiOff className="h-5 w-5 text-destructive" />
              )}
              <span className="font-medium">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <Badge 
              variant={isConnected ? "default" : "secondary"}
              className={isConnected ? "bg-success-subtle text-success border-success/20" : ""}
            >
              {isConnected ? "Active" : "Inactive"}
            </Badge>
          </div>

          {!isConnected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endpoint">API Endpoint</Label>
                <Input
                  id="endpoint"
                  placeholder="https://api.informatica.com/v1/stewardship"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {!isConnected ? (
              <Button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="flex items-center gap-2"
              >
                {isConnecting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Settings className="h-4 w-4" />
                )}
                {isConnecting ? "Connecting..." : "Connect"}
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={handleDisconnect}
                className="flex items-center gap-2"
              >
                <WifiOff className="h-4 w-4" />
                Disconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Live Stream */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Live Request Stream
              <Badge variant="outline" className="ml-auto">
                {streamingRequests.length} Active
              </Badge>
            </CardTitle>
            <CardDescription>
              Real-time stewardship requests from Informatica
            </CardDescription>
          </CardHeader>
          <CardContent>
            {streamingRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Waiting for incoming requests...</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {streamingRequests.map((request) => (
                  <Card key={request.id} className="border border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">NPI: {request.npi}</span>
                            <Badge variant="outline" className="text-xs">
                              {request.type.replace('_', ' ')}
                            </Badge>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)}
                              {request.status}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(request.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Informatica
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Integration Stats */}
      {isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Requests Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2s</div>
              <p className="text-xs text-muted-foreground">Average response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.7%</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};