import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ValidationChecks } from "./ValidationChecks";
import { ExternalSearch } from "./ExternalSearch";
import { ArrowLeft, UserCheck, FileText, Search, Clock, CheckCircle, XCircle, AlertTriangle, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getNPIProfile } from "@/data/npiProfiles";

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

interface RequestDetailsProps {
  request: StewardshipRequest;
  onBack: () => void;
}

export const RequestDetails = ({ request, onBack }: RequestDetailsProps) => {
  const [activeTab, setActiveTab] = useState<"validation" | "investigation" | "profile">("validation");
  const [stewardNotes, setStewardNotes] = useState("");
  const { toast } = useToast();
  
  // Get NPI profile data
  const npiProfile = getNPIProfile(request.npi);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-5 w-5" />;
      case "approved": return <CheckCircle className="h-5 w-5" />;
      case "rejected": return <XCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case "specialty_update": return <UserCheck className="h-5 w-5" />;
      case "license_verification": return <FileText className="h-5 w-5" />;
      case "address_update": return <Search className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const handleApprove = () => {
    toast({
      title: "Request Approved",
      description: `Request #${request.requestNumber} has been approved successfully.`,
    });
  };

  const handleReject = () => {
    toast({
      title: "Request Rejected", 
      description: `Request #${request.requestNumber} has been rejected.`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Request Details</h1>
            <p className="text-muted-foreground">
              Review and validate stewardship request #{request.requestNumber}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Request Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getRequestTypeIcon(request.requestType)}
                    <div>
                      <CardTitle>Request #{request.requestNumber}</CardTitle>
                      <CardDescription>NPI: {request.npi}</CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      request.status === "pending" ? "pending" :
                      request.status === "approved" ? "approved" : "rejected"
                    }
                  >
                    <div className="flex items-center gap-1">
                      {getStatusIcon(request.status)}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Request Description</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    {request.description}
                  </p>
                </div>

                {request.currentValue && request.proposedValue && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 text-destructive">Current Value</h4>
                      <p className="text-sm bg-destructive-subtle p-3 rounded-md border border-destructive/20">
                        Doctor of Medicine
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-success">Proposed Value</h4>
                      <p className="text-sm bg-success-subtle p-3 rounded-md border border-success/20">
                        {request.proposedValue}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Submitted: {new Date(request.submittedDate).toLocaleString()}</span>
                  <Badge variant="outline" className="capitalize">
                    {request.priority} Priority
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <div className="flex gap-2 border-b">
              <Button
                variant={activeTab === "validation" ? "default" : "ghost"}
                onClick={() => setActiveTab("validation")}
                className="rounded-b-none"
              >
                Validation
              </Button>
              <Button
                variant={activeTab === "investigation" ? "default" : "ghost"}
                onClick={() => setActiveTab("investigation")}
                className="rounded-b-none"
              >
                Investigation & Search
              </Button>
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                onClick={() => setActiveTab("profile")}
                className="rounded-b-none"
              >
                <User className="h-4 w-4 mr-2" />
                Profile Information
              </Button>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "validation" && <ValidationChecks request={request} />}
              {activeTab === "investigation" && <ExternalSearch request={request} />}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  {npiProfile ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-5 w-5" />
                          NPI Profile Details
                        </CardTitle>
                        <CardDescription>
                          Complete provider information for NPI {npiProfile.npi}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-3">Provider Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Full Name:</span>
                                  <span className="font-medium">{npiProfile.formattedName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">NPI Number:</span>
                                  <span className="font-medium">{npiProfile.npi}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Specialty:</span>
                                  <span className="font-medium">{npiProfile.specialty}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">Profile Status:</span>
                                  <Badge variant={npiProfile.profileStatus === "Active" ? "approved" : "outline"}>
                                    {npiProfile.profileStatus}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-3">Practice Address</h4>
                              <div className="space-y-1 text-sm bg-muted p-3 rounded-md">
                                <p className="font-medium">{npiProfile.addrLine1}</p>
                                {npiProfile.addrLine2 && <p>{npiProfile.addrLine2}</p>}
                                {npiProfile.addrLine3 && <p>{npiProfile.addrLine3}</p>}
                                <p>{npiProfile.city}, {npiProfile.state} {npiProfile.zipCode}</p>
                                <p className="text-muted-foreground">{npiProfile.country}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-3">License Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">License State:</span>
                                  <span className="font-medium">{npiProfile.licenseState}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">License Type:</span>
                                  <span className="font-medium">{npiProfile.licenseType}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">License Number:</span>
                                  <span className="font-medium">{npiProfile.licenseNumber}</span>
                                </div>
                                {npiProfile.licenseStatus && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">License Status:</span>
                                    <Badge variant={npiProfile.licenseStatus === "A" ? "approved" : "outline"}>
                                      {npiProfile.licenseStatus === "A" ? "Active" : npiProfile.licenseStatus}
                                    </Badge>
                                  </div>
                                )}
                                {npiProfile.licenseStartDate && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Start Date:</span>
                                    <span className="font-medium">{npiProfile.licenseStartDate}</span>
                                  </div>
                                )}
                                {npiProfile.licenseExpirationDate && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Expiration Date:</span>
                                    <span className="font-medium">{npiProfile.licenseExpirationDate}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-3">Verification Status</h4>
                              <div className="p-3 bg-success-subtle rounded-md border border-success/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircle className="h-4 w-4 text-success" />
                                  <span className="font-medium text-success">Profile Verified</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  This NPI profile has been verified against official registry data.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-warning" />
                          No Profile Data Available
                        </CardTitle>
                        <CardDescription>
                          No profile information found for NPI {request.npi}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 bg-warning-subtle rounded-md border border-warning/20">
                          <p className="text-sm text-muted-foreground">
                            This NPI number was not found in our registry database. 
                            Please verify the NPI number or check external sources for provider information.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Action Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Steward Actions</CardTitle>
                <CardDescription>Review and take action on this request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Steward Notes</label>
                  <Textarea
                    placeholder="Add your validation notes and findings..."
                    value={stewardNotes}
                    onChange={(e) => setStewardNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Button 
                    variant="success" 
                    className="w-full" 
                    onClick={handleApprove}
                    disabled={request.status !== "pending"}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Request
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={handleReject}
                    disabled={request.status !== "pending"}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Request
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Request Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Request Submitted</p>
                      <p className="text-muted-foreground">
                        {new Date(request.submittedDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {request.status === "pending" && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                      <div className="text-sm">
                        <p className="font-medium">Under Review</p>
                        <p className="text-muted-foreground">Currently being validated</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Request Type:</span>
                  <span className="font-medium capitalize">
                    {request.requestType.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Priority:</span>
                  <span className="font-medium capitalize">{request.priority}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">NPI Number:</span>
                  <span className="font-medium">{request.npi}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium capitalize">{request.status}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};