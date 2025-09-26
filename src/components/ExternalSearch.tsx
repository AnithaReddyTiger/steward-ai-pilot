import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, ExternalLink, Globe, Database, MapPin, FileText, Building, AlertCircle, User, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getNPIProfile } from "@/data/npiProfiles";

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

export const ExternalSearch = ({
  request
}: ExternalSearchProps) => {
  // Get NPI profile data
  const npiProfile = getNPIProfile(request.npi);
  const npiID = request.npi;

  // Generate mock results based on NPI and request
  const generateMockResults = () => {
    const providerName = npiProfile?.formattedName || "Provider Name";
    const specialty = npiProfile?.specialty || "Healthcare Provider";
    const city = npiProfile?.city || "Unknown City";
    const state = npiProfile?.state || "Unknown State";

    return {
      nppes: {
        source: "NPPES NPI Registry",
        url: "https://npiregistry.cms.hhs.gov/search",
        status: "found" as const,
        data: [{
          npi: request.npi,
          name: providerName.toUpperCase(),
          specialty: specialty,
          address: `${npiProfile?.addrLine1 || "Address"}, ${city}, ${state} ${npiProfile?.zipCode || "00000"}`,
          lastUpdated: "2024-01-15"
        }],
        notes: "Found active NPI record with current information"
      },
      doximity: {
        source: "Doximity",
        url: "https://www.doximity.com/",
        status: "found" as const,
        data: [{
          profile: "Active professional profile found",
          specialty: specialty,
          education: "Accredited Medical Institution",
          affiliations: `${city} Medical Center`
        }],
        notes: `Professional profile confirms specialty as ${specialty}`
      },
      webmd: {
        source: "WebMD",
        url: "https://doctor.webmd.com/",
        status: "not_found" as const,
        notes: "No profile found in WebMD directory"
      },
      nursys: {
        source: "Nursys",
        url: "https://www.nursys.com/LQC/LQCSearch.aspx",
        status: specialty.toLowerCase().includes("nurse") ? "found" as const : "not_found" as const,
        data: specialty.toLowerCase().includes("nurse") ? [{
          license: "Active",
          licenseNumber: npiProfile?.licenseNumber || "RN123456",
          expirationDate: "12/31/2025",
          state: state.toUpperCase(),
          disciplinaryActions: "None"
        }] : undefined,
        notes: specialty.toLowerCase().includes("nurse") ? `Current nursing license verified, expires Dec 2025` : "No nursing license found - not applicable for this provider type"
      }
    };
  };

  const [searchResults, setSearchResults] = useState<Record<string, SearchResult>>(generateMockResults);
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

  useEffect(() => {
    if (npiID === "1164037024") {
      setSearchResults({
        nppes: {
          source: "NPPES NPI Registry",
          url: "https://npiregistry.cms.hhs.gov/search",
          status: "found" as const,
          data: [{
            npi: request.npi,
            name: "AMINATA AW NP",
            specialty: "Registered Nurse",
            address: "PO BOX 6282 SHERIDAN, WY 82801-1682",
            lastUpdated: "2022-11-03"
          }],
          notes: "Found multiple active NPI profiles"
        },
        doximity: {
          source: "Doximity",
          url: "https://www.doximity.com/",
          status: "found" as const,
          data: [{
            profile: "Active physician profile found",
            specialty: "Registered Nurse",
            education: "Texas Tech University Health Sciences Center",
            affiliations: "Cheyenne Regional Medical Center"
          }],
          notes: "Professional profile confirms specialty as Registered Nurse"
        },
        webmd: {
          source: "WebMD",
          url: "https://doctor.webmd.com/",
          status: "found" as const,
          data: [{
            npi: request.npi,
            name: "AMINATA AW",
            specialty: "Registered Nurse"
          }],
          notes: "Profile found in WebMD directory"
        },
        nursys: {
          source: "Nursys",
          url: "https://www.nursys.com/LQC/LQCSearch.aspx",
          status: "found" as const,
          data: [{
            license: "Active",
            licenseNumber: "27748",
            licenseType: "RN",
            expirationDate: "12/31/2026",
            state: "WYOMING",
            disciplinaryActions: "None"
          }],
          notes: "Current nursing license verified, expires Dec 2026"
        },
        google: {
          source: "Google Search",
          url: "",
          status: "found" as const,
          data: [{
            results: "Nurse Practitioner in Cheyenne, WY, affiliated with Cheyenne Regional Medical Center"
          }],
          notes: "Multiple sources confirm employment and credentials"
        }
      });
    } else if (npiID === "1356035752") {
      setSearchResults({
        nppes: {
          source: "NPPES NPI Registry",
          url: "https://npiregistry.cms.hhs.gov/search",
          status: "found" as const,
          data: [{
            npi: request.npi,
            name: "DENA KENDRICK LOWE FNP",
            specialty: "Nurse Practitioner",
            address: "2309 E MAIN ST NEW IBERIA, LA 70560"
          }],
          notes: "Found NPI record with current information"
        },
        doximity: {
          source: "Doximity",
          url: "https://www.doximity.com/",
          status: "not_found" as const,
          notes: "No profile found in Doximity directory"
        },
        webmd: {
          source: "WebMD",
          url: "https://doctor.webmd.com/",
          data: [{
            name: "DENA KENDRICK LOWE FNP",
            specialty: "NP",
            address: ""
          }],
          status: "found" as const,
          notes: "Profile found in WebMD directory"
        },
        nursys: {
          source: "Nursys",
          url: "https://www.nursys.com/LQC/LQCSearch.aspx",
          status: "found" as const,
          data: [{
           "license": "Active",
           "license Number": "RN112760",
           "State": "LOUISIANA-RN",
           "Expiration Date": "2026-01-31",
           "Disciplinary Actions": "None"
          }],
          notes: "Current nursing license verified, expires Jan 2026"
        }
      });
    } else if (npiID === "1780827816") {
      setSearchResults({
        nppes: {
          source: "NPPES NPI Registry",
          url: "https://npiregistry.cms.hhs.gov/search",
          status: "found" as const,
          data: [{
            npi: request.npi,
            name: "JESSY TOM PATTANIYIL NPC",
            specialty: "Registered Nurse",
            address: "6501 HARBISON AVE, PHILADELPHIA, PA 19149-2912",
            lastUpdated: "2022-05-24"
          }],
          notes: "Found active NPI record with current information"
        },
        doximity: {
          source: "Doximity",
          url: "https://www.doximity.com/",
          status: "not_found" as const,
          notes: "No profile found in Doximity directory"
        },
        webmd: {
          source: "WebMD",
          url: "https://doctor.webmd.com/",
          status: "not_found" as const,
          notes: "No profile found in WebMD directory"
        },
        nursys: {
          source: "Nursys",
          url: "https://www.nursys.com/LQC/LQCSearch.aspx",
          status: "found" as const,
          data: [{
            license: "Active",
            licenseNumber: "RN534583",
            expirationDate: "2027-04-30",
            state: "PENNSYLVANIA",
            disciplinaryActions: "None"
          }],
          notes: "Current nursing license verified, expires April 2027"
        },
        google: {
          source: "Google Search",
          url: "",
          status: "found" as const,
          data: [{
            results: "Family nurse practitioner; Studied MSN at Holy Family University; Specialties: Nursing (Nurse Practitioner); Practice location: 6501 Haribson Ave, Philadelphia, PA 19149"
          }],
          notes: "Multiple sources confirm employment and credentials"
        }
      });
    }
     else if (npiID === "NA") {
      setSearchResults({
        nppes: {
          source: "NPPES NPI Registry",
          url: "https://npiregistry.cms.hhs.gov/search",
          status: "found" as const,
          data:  [
        {
    "npi": "1659184745",
    "name": "ALEXA BAILY",
    "specialty": "Counselor",
    "address": "95 E HIGH ST STE 407, WAYNESBURG, PA 15370-1853",
    "phone": "614-325-6384"
      },
  {
    "npi": "1720662828",
    "name": "ALEX GREEN",
    "specialty": "Student",
    "address": "20 YORK ST, NEW HAVEN, CT 06510-3220",
    "phone": "203-688-4242"
  },
  {
    "npi": "1356087407",
    "name": "ALEXANDRA GREEN",
    "specialty": "Nurse Practitioner",
    "address": "3401 N BROAD ST, PHILADELPHIA, PA 19140-5189",
    "phone": "215-707-8484"
  },
  {
    "npi": "1396336608",
    "name": "ALEXANDRA GREEN",
    "specialty": "Physician Assistant",
    "address": "300 HALKET ST STE 2601, PITTSBURGH, PA 15213-3108",
    "phone": "412-641-4274"
  },
  {
    "npi": "1629730619",
    "name": "ALEXANDRA GREEN",
    "specialty": "Student",
    "address": "1905 OREGON PIKE APT F9, LANCASTER, PA 17601-6446",
    "phone": "717-406-9952"
  }
],
          notes: "Found active NPI record with current information"
        },
        doximity: {
          source: "Doximity",
          url: "https://www.doximity.com/",
          status: "not_found" as const,
          notes: "No profile found in Doximity directory"
        },
        webmd: {
          source: "WebMD",
          url: "https://doctor.webmd.com/",
          status: "not_found" as const,
          notes: "No profile found in WebMD directory"
        },
        nursys: {
          source: "Nursys",
          url: "https://www.nursys.com/LQC/LQCSearch.aspx",
          status: "not_found" as const,
          data:[],
          notes: "No profile found in Nursys directory"
        },
        google: {
          source: "Google Search",
          url: "",
          status: "not_found" as const,
          data: [{
            results: "Family nurse practitioner; Studied MSN at Holy Family University; Specialties: Nursing (Nurse Practitioner)"
          }],
          notes: "No profile found through Google Search"
        }
      });
    }
  }, [npiID, request]);

  const performAllSearches = async () => {
    // Set all sources to searching status
    const updatedResults = { ...searchResults };
    Object.keys(updatedResults).forEach(sourceId => {
      updatedResults[sourceId] = {
        ...updatedResults[sourceId],
        status: "searching"
      };
    });
    setSearchResults(updatedResults);

    // Simulate search delay for all sources
    setTimeout(() => {
      // Update all search results at once
      const finalResults = generateMockResults();
      setSearchResults(finalResults);
      toast({
        title: "Investigation Completed",
        description: "All external sources have been searched successfully"
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
      case "found":
        return <div className="w-2 h-2 bg-success rounded-full"></div>;
      case "not_found":
        return <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>;
      case "searching":
        return <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>;
      case "error":
        return <div className="w-2 h-2 bg-destructive rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "found":
        return <Badge variant="approved" className="text-xs">Found</Badge>;
      case "not_found":
        return <Badge variant="outline" className="text-xs">Not Found</Badge>;
      case "searching":
        return <Badge variant="pending" className="text-xs">Searching...</Badge>;
      case "error":
        return <Badge variant="rejected" className="text-xs">Error</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Not Started</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* NPI Profile Information */}
      

      {/* Investigation Control and Summary Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">TA Steward.ai Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
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
              <div>
                <h4 className="font-medium mb-2">Key Findings</h4>
                <div className="text-sm text-muted-foreground">
                  {request.npi === "1164037024" && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Multiple specialties found in current data systems</li>
                      <li>TASteward.ai found NPI matches on reference data-sources and determined request is valid</li>
                      <li>TASteward.ai recommendation – update Specialty to 'Registered Nurse'</li>
                      <li>Confidence: Very High</li>
                    </ul>
                  )}
                  {request.npi === "1356035752" && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Requestor submitted a request to investigate‘expired license and associate a new active license’</li>
                      <li>TASteward.ai found license information for NPI on Nursys which shows license is still active till Jan 2026</li>
                      <li>TASteward.ai recommends rejecting the request to inactive license as current expiration date is valid</li>
                      <li>Confidence: High</li>
                    </ul>
                  )}
                  {request.npi === "1780827816" && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>1 linked address was identified in current data systems</li>
                      <li>TASteward.ai found multiple addresses for this HCP on reference data-sources and determined request is valid</li>
                      <li>TASteward.ai recommendation – update Address to '6501 Harbison Ave, Philadelphia, PA 19149-2912'</li>
                      <li>Confidence: Very High</li>
                    </ul>
                  )}
                    {request.npi === "NA" && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>5 matching profiles are identified in external data systems.</li>
                      <li>TASteward.ai found multiple profiles for this HCP on reference data-sources and listed the relavent ones.</li>
                      <li>TASteward.ai recommendation – 4/5 profiles seem to match based on name & state, steward can choose appropriate profile to be created.</li>
                      <li>Confidence: Low</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              
            </div>
          </CardContent>
        </Card>

        {/* Search Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
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
            </div>

            <div className="space-y-2">
              <h4 className="font-medium mb-2">Sources Found:</h4>
              <ul className="space-y-1">
                {Object.entries(searchResults)
                  .filter(([_, result]) => result.status === "found")
                  .map(([sourceId, result]) => (
                    <li key={sourceId} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                      {result.url ? (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {result.source}
                        </a>
                      ) : (
                        <span>{result.source}</span>
                      )}
                    </li>
                  ))}
              </ul>
              {Object.values(searchResults).filter(r => r.status === "found").length === 0 && (
                <p className="text-sm text-muted-foreground">No sources found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Sources */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">External Data Sources</h3>
        
        {searchSources.map(source => {
          const result = searchResults[source.id];
          if (!result) return null;
          
          return (
            <Card key={source.id} className="transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      {source.icon}
                      {getStatusIcon(result.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-medium">{source.name}</h4>
                        {source.recommended && (
                          <Badge variant="medical" className="text-xs">Recommended</Badge>
                        )}
                        {getStatusBadge(result.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{source.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Search method: {source.searchType}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {result.url && (
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
                {result.status === "found" && result.data &&  result.data.map((dataset)=>{
             return(
                           <div className="mt-4 p-3 bg-success-subtle rounded-md border border-success/20">
                           <h5 className="font-medium text-success mb-2">Search Results</h5>
                               
              {
                (Object.entries(dataset || {}).map(([key, value]) => {
                        return(
                          
                           <div className="text-sm space-y-1">
                          <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}:
                          </span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                         </div>
                               )
                        })) 
              }
                             
                       </div>)     
                        })
                      
}

                {/* Search Notes */}
                {result.notes && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    <span className="font-medium">Notes:</span> {result.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom Search */}
      

    </div>
  );
};