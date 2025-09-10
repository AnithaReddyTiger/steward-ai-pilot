import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RequestDetails } from "./RequestDetails";
import { Search, Filter, FileText, UserCheck, Clock, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface StewardshipRequest {
  id: string;
  npi: string;
  requestNumber: number;
  description: string;
  status: "pending" | "approved" | "rejected";
  requestType: "specialty_update" | "license_verification" | "address_update";
  submittedDate: string;
  priority: "high" | "medium" | "low";
  currentValue?: string;
  proposedValue?: string;
}

const mockRequests: StewardshipRequest[] = [
  {
    id: "1",
    npi: "1164037024",
    requestNumber: 1,
    description: "Current specialty is not correct. It should be updated to 'Registered Nurse'",
    status: "pending",
    requestType: "specialty_update",
    submittedDate: "2024-01-15T10:30:00Z",
    priority: "high",
    currentValue: "Medical Assistant",
    proposedValue: "Registered Nurse"
  },
  {
    id: "2", 
    npi: "1164037024",
    requestNumber: 2,
    description: "There is no license information present about expiration. Investigate License status if it's still active & expiration date",
    status: "pending",
    requestType: "license_verification", 
    submittedDate: "2024-01-15T10:35:00Z",
    priority: "medium"
  },
  {
    id: "3",
    npi: "1234567890",
    requestNumber: 3,
    description: "Address needs to be updated to reflect current practice location",
    status: "approved",
    requestType: "address_update",
    submittedDate: "2024-01-14T14:20:00Z",
    priority: "low",
    currentValue: "123 Old St, City, ST 12345",
    proposedValue: "456 New Ave, City, ST 67890"
  }
];

export const Dashboard = () => {
  const [selectedRequest, setSelectedRequest] = useState<StewardshipRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = request.npi.includes(searchTerm) || 
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case "specialty_update": return <UserCheck className="h-4 w-4" />;
      case "license_verification": return <FileText className="h-4 w-4" />;
      case "address_update": return <Search className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive-subtle text-destructive border-destructive/20";
      case "medium": return "bg-warning-subtle text-warning border-warning/20";
      case "low": return "bg-success-subtle text-success border-success/20";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  if (selectedRequest) {
    return <RequestDetails request={selectedRequest} onBack={() => setSelectedRequest(null)} />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Healthcare Stewardship Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and validate healthcare provider information requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-status-pending">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockRequests.filter(r => r.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-status-approved">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockRequests.filter(r => r.status === "approved").length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-status-rejected">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockRequests.filter(r => r.status === "rejected").length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockRequests.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stewardship Requests</CardTitle>
            <CardDescription>View and manage healthcare provider update requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by NPI or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "warning" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === "approved" ? "success" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("approved")}
                >
                  Approved
                </Button>
                <Button
                  variant={statusFilter === "rejected" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("rejected")}
                >
                  Rejected
                </Button>
              </div>
            </div>

            {/* Requests List */}
            <div className="space-y-3">
              {filteredRequests.map((request) => (
                <Card 
                  key={request.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary/20 hover:border-l-primary"
                  onClick={() => setSelectedRequest(request)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getRequestTypeIcon(request.requestType)}
                            <span className="font-semibold">Request #{request.requestNumber}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            NPI: {request.npi}
                          </Badge>
                          <Badge 
                            variant={
                              request.status === "pending" ? "pending" :
                              request.status === "approved" ? "approved" : "rejected"
                            }
                            className="text-xs"
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(request.status)}
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </div>
                          </Badge>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{request.description}</p>
                        
                        {request.currentValue && request.proposedValue && (
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Current:</span> {request.currentValue} → 
                            <span className="font-medium"> Proposed:</span> {request.proposedValue}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right text-xs text-muted-foreground">
                        {new Date(request.submittedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};