import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, ExternalLink, Globe, Database, MapPin, FileText, Building, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExternalSearchProps {
  request: {
    npi: string;
    requestType: string;
    description: string;
  };
}

interface SearchResult {
  source: string;
  url: string;
  status: "found" | "not_found" | "searching" | "error";
  data?: any;
  notes?: string;
}

export const ExternalSearch = ({ request }: ExternalSearchProps) => {
  const [searchResults, setSearchResults] = useState<Record<string, SearchResult>>({
    nppes: { source: "NPPES NPI Registry", url: "https://npiregistry.cms.hhs.gov/search", status: "not_found" },
    doximity: { source: "Doximity", url: "https://www.doximity.com/", status: "not_found" },
    webmd: { source: "WebMD", url: "https://doctor.webmd.com/", status: "not_found" },
    nursys: { source: "Nursys", url: "https://www.nursys.com/LQC/LQCSearch.aspx", status: "not_found" },
    google: { source: "Google Search", url: "", status: "not_found" }
  });
  
  const [searchNotes, setSearchNotes] = useState("");
  const [customSearchUrl, setCustomSearchUrl] = useState("");
  const { toast } = useToast();

  const searchSources = [
    {
      id: "nppes",
      name: "NPPES NPI Registry",
      description: "Official CMS NPI database search",
      icon: <Database className="h-4 w-4" />,
      searchType: "NPI",
      recommended: true
    },
    {
      id: "doximity", 
      name: "Doximity",
      description: "Professional medical network",
      icon: <Building className="h-4 w-4" />,
      searchType: "Name + Location",
      recommended: true
    },
    {
      id: "webmd",
      name: "WebMD Doctor Directory", 
      description: "Healthcare provider directory",
      icon: <FileText className="h-4 w-4" />,
      searchType: "Name + Location",
      recommended: false
    },
    {
      id: "nursys",
      name: "Nursys License Verification",
      description: "Nursing license verification system",
      icon: <FileText className="h-4 w-4" />,
      searchType: "License Verification",
      recommended: request.requestType === "license_verification"
    },
    {
      id: "google",
      name: "Google Search",
      description: "General web search for provider information",
      icon: <Globe className="h-4 w-4" />,
      searchType: "Name + City + State",
      recommended: false
    }
  ];

  const performSearch = async (sourceId: string) => {
    setSearchResults(prev => ({
      ...prev,
      [sourceId]: { ...prev[sourceId], status: "searching" }
    }));

    // Simulate search delay
    setTimeout(() => {
      // Mock search results
      const mockResults = {
        nppes: {
          status: "found" as const,
          data: {
            npi: request.npi,
            name: "John Doe, RN",
            specialty: "Registered Nurse",
            address: "123 Healthcare Blvd, Medical City, MC 12345",
            lastUpdated: "2024-01-10"
          },
          notes: "Found active NPI record with current information"
        },
        doximity: {
          status: "found" as const,
          data: {
            profile: "Active physician profile found",
            specialty: "Registered Nurse", 
            education: "State University School of Nursing",
            affiliations: "Medical Center Hospital"
          },
          notes: "Professional profile confirms specialty as Registered Nurse"
        },
        webmd: {
          status: "not_found" as const,
          notes: "No profile found in WebMD directory"
        },
        nursys: {
          status: "found" as const,
          data: {
            license: "Active",
            licenseNumber: "RN123456",
            expirationDate: "2025-06-30",
            state: "Medical State",
            disciplinaryActions: "None"
          },
          notes: "Current nursing license verified, expires June 2025"
        },
        google: {
          status: "found" as const,
          data: {
            results: [
              "Medical Center Hospital staff directory",
              "State nursing board website",
              "Professional association listing"
            ]
          },
          notes: "Multiple sources confirm employment and credentials"
        }
      };

      setSearchResults(prev => ({
        ...prev,
        [sourceId]: { 
          ...prev[sourceId], 
          ...mockResults[sourceId as keyof typeof mockResults]
        }
      }));

      toast({
        title: "Search Completed",
        description: `Search completed for ${searchSources.find(s => s.id === sourceId)?.name}`,
      });
    }, 2000);
  };

  const openExternalSearch = (sourceId: string) => {
    const source = searchSources.find(s => s.id === sourceId);
    if (source && searchResults[sourceId].url) {
      window.open(searchResults[sourceId].url, '_blank');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "found": return <div className="w-2 h-2 bg-success rounded-full"></div>;
      case "not_found": return <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>;
      case "searching": return <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>;
      case "error": return <div className="w-2 h-2 bg-destructive rounded-full"></div>;
      default: return <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "found": return <Badge variant="approved" className="text-xs">Found</Badge>;
      case "not_found": return <Badge variant="outline" className="text-xs">Not Found</Badge>;
      case "searching": return <Badge variant="pending" className="text-xs">Searching...</Badge>;
      case "error": return <Badge variant="rejected" className="text-xs">Error</Badge>;
      default: return <Badge variant="outline" className="text-xs">Not Started</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">External Search Strategy</CardTitle>
          <CardDescription>
            Corroborate findings using multiple trusted healthcare data sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-medical-blue-light p-4 rounded-md border border-medical-blue/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-medical-blue mt-0.5" />
              <div>
                <h4 className="font-medium text-medical-blue">Search Guidelines</h4>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Start with NPI-based searches for most reliable results</li>
                  <li>• Use Name + Address combinations for verification</li>
                  <li>• Cross-reference findings across multiple sources</li>
                  <li>• Focus on trusted healthcare websites and databases</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Primary Identifiers</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">NPI:</span> {request.npi}</p>
                <p><span className="font-medium">Search Type:</span> {request.requestType.replace('_', ' ')}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Search Focus</h4>
              <div className="text-sm text-muted-foreground">
                {request.requestType === "specialty_update" && "Verify specialty credentials and qualifications"}
                {request.requestType === "license_verification" && "Check license status and expiration dates"}
                {request.requestType === "address_update" && "Validate current practice addresses"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Sources */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">External Data Sources</h3>
        
        {searchSources.map((source) => (
          <Card key={source.id} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    {source.icon}
                    {getStatusIcon(searchResults[source.id].status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium">{source.name}</h4>
                      {source.recommended && (
                        <Badge variant="medical" className="text-xs">Recommended</Badge>
                      )}
                      {getStatusBadge(searchResults[source.id].status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{source.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Search method: {source.searchType}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => performSearch(source.id)}
                    disabled={searchResults[source.id].status === "searching"}
                  >
                    <Search className="h-4 w-4 mr-1" />
                    {searchResults[source.id].status === "searching" ? "Searching..." : "Search"}
                  </Button>
                  {searchResults[source.id].url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openExternalSearch(source.id)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Search Results */}
              {searchResults[source.id].status === "found" && searchResults[source.id].data && (
                <div className="mt-4 p-3 bg-success-subtle rounded-md border border-success/20">
                  <h5 className="font-medium text-success mb-2">Search Results</h5>
                  <div className="text-sm space-y-1">
                    {Object.entries(searchResults[source.id].data || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Notes */}
              {searchResults[source.id].notes && (
                <div className="mt-3 text-xs text-muted-foreground">
                  <span className="font-medium">Notes:</span> {searchResults[source.id].notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Custom External Search</CardTitle>
          <CardDescription>Add additional search sources or manual verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter custom search URL..."
              value={customSearchUrl}
              onChange={(e) => setCustomSearchUrl(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={() => window.open(customSearchUrl, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-1" />
              Open
            </Button>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Investigation Notes</label>
            <Textarea
              placeholder="Document your external search findings, cross-references, and verification steps..."
              value={searchNotes}
              onChange={(e) => setSearchNotes(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Search Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {Object.values(searchResults).filter(r => r.status === "found").length}
              </div>
              <div className="text-sm text-muted-foreground">Sources Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {Object.values(searchResults).filter(r => r.status === "not_found").length}
              </div>
              <div className="text-sm text-muted-foreground">Not Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {Object.values(searchResults).filter(r => r.status === "searching").length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {Object.values(searchResults).filter(r => r.status === "error").length}
              </div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Recommendation:</p>
            <p>
              Based on search results, the information appears to be 
              {Object.values(searchResults).filter(r => r.status === "found").length >= 2 
                ? " consistent across multiple sources and can be verified." 
                : " limited. Additional investigation may be required."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};