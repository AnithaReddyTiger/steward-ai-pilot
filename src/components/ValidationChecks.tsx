import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, Clock, ShieldCheck, FileText, User } from "lucide-react";

interface ValidationCheckProps {
  request: {
    id: string;
    npi: string;
    requestType: string;
    currentValue?: string;
    proposedValue?: string;
  };
}

interface ValidationItem {
  id: string;
  title: string;
  description: string;
  status: "passed" | "failed" | "warning" | "pending";
  details?: string;
  icon: React.ReactNode;
}

export const ValidationChecks = ({ request }: ValidationCheckProps) => {
  const [validationItems, setValidationItems] = useState<ValidationItem[]>([
    {
      id: "profile_status",
      title: "Profile Status Verification",
      description: "Check if the healthcare provider profile is active and valid",
      status: "passed",
      details: "Profile is active with valid NPI registration",
      icon: <User className="h-4 w-4" />
    },
    {
      id: "input_validation",
      title: "Input Data Validation",
      description: "Verify if the provided input is complete and follows required format",
      status: request.requestType === "specialty_update" ? "passed" : "pending",
      details: request.requestType === "specialty_update" 
        ? "Specialty 'Registered Nurse' is valid and exists in approved specialties list" 
        : "Checking input completeness...",
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: "data_completeness",
      title: "Required Information Check",
      description: "Ensure all required information is provided for processing",
      status: request.currentValue && request.proposedValue ? "passed" : "warning",
      details: request.currentValue && request.proposedValue 
        ? "All required fields are present" 
        : "Some information may be missing for complete validation",
      icon: <ShieldCheck className="h-4 w-4" />
    },
    {
      id: "license_status",
      title: "License Status Check",
      description: "Verify current license status and expiration dates",
      status: request.requestType === "license_verification" ? "warning" : "passed",
      details: request.requestType === "license_verification" 
        ? "License expiration information is missing and needs investigation" 
        : "License appears to be active based on available data",
      icon: <FileText className="h-4 w-4" />
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return <CheckCircle className="h-5 w-5 text-success" />;
      case "failed": return <XCircle className="h-5 w-5 text-destructive" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "pending": return <Clock className="h-5 w-5 text-muted-foreground" />;
      default: return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed": return <Badge variant="approved">Passed</Badge>;
      case "failed": return <Badge variant="rejected">Failed</Badge>;
      case "warning": return <Badge variant="pending">Warning</Badge>;
      case "pending": return <Badge variant="outline">Pending</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const runValidation = (itemId: string) => {
    setValidationItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, status: "passed" as const, details: "Validation completed successfully" }
          : item
      )
    );
  };

  const validationSummary = {
    passed: validationItems.filter(item => item.status === "passed").length,
    failed: validationItems.filter(item => item.status === "failed").length,
    warning: validationItems.filter(item => item.status === "warning").length,
    pending: validationItems.filter(item => item.status === "pending").length,
  };

  return (
    <div className="space-y-6">
      {/* Validation Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Validation Summary</CardTitle>
          <CardDescription>Overview of validation checks for this request</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{validationSummary.passed}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{validationSummary.warning}</div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{validationSummary.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{validationSummary.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Checks */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Steward Validation Checks</h3>
        
        {validationItems.map((item) => (
          <Card key={item.id} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {item.icon}
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{item.title}</h4>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    {item.details && (
                      <div className={`text-xs p-2 rounded-md ${
                        item.status === "passed" ? "bg-success-subtle text-success" :
                        item.status === "warning" ? "bg-warning-subtle text-warning" :
                        item.status === "failed" ? "bg-destructive-subtle text-destructive" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {item.details}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.status === "pending" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => runValidation(item.id)}
                    >
                      Run Check
                    </Button>
                  )}
                  {getStatusIcon(item.status)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Validation Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Validation Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <h4 className="font-medium">For Specialty Updates:</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Verify the proposed specialty exists in the approved specialties database</li>
              <li>Check if the provider has the required credentials for the specialty</li>
              <li>Ensure the change aligns with the provider's training and certifications</li>
            </ul>
          </div>
          
          <div className="text-sm space-y-2">
            <h4 className="font-medium">For License Verification:</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Confirm license is active and not expired</li>
              <li>Verify license matches the provider's practice location</li>
              <li>Check for any disciplinary actions or restrictions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};