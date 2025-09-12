import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Bell, ChevronDown } from "lucide-react";
interface StewardProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  workload: number;
  completedToday: number;
  certifications: string[];
}
const mockStewardProfile: StewardProfile = {
  id: "ST001",
  name: "Dr. Sarah Chen",
  email: "sarah.chen@healthcare.org",
  role: "Senior Healthcare Steward",
  department: "Provider Data Management",
  workload: 2,
  completedToday: 8,
  certifications: ["RHIA", "CCS", "CHPS"]
};
export const StewardshipTopBar = () => {
  return <div className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Healthcare Stewardship</h1>
                <p className="text-sm text-muted-foreground">Provider Data Validation System</p>
              </div>
            </div>
          </div>

          {/* Center - Current Workload Stats */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="text-center">
              
              
            </div>
            <div className="text-center">
              
              
            </div>
            <div className="text-center">
              
              
            </div>
          </div>

          {/* Right side - Steward Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 hover:bg-accent/50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={mockStewardProfile.avatar} alt={mockStewardProfile.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {mockStewardProfile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-foreground">{mockStewardProfile.name}</div>
                    <div className="text-xs text-muted-foreground">{mockStewardProfile.role}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={mockStewardProfile.avatar} alt={mockStewardProfile.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {mockStewardProfile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{mockStewardProfile.name}</div>
                        <div className="text-sm text-muted-foreground">{mockStewardProfile.email}</div>
                        <div className="text-xs text-muted-foreground">{mockStewardProfile.department}</div>
                      </div>
                    </div>
                    
                    {/* Certifications */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">Certifications</div>
                      <div className="flex flex-wrap gap-1">
                        {mockStewardProfile.certifications.map(cert => <Badge key={cert} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>)}
                      </div>
                    </div>

                    {/* Today's Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-primary">{mockStewardProfile.workload}</div>
                        <div className="text-xs text-muted-foreground">Pending</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-success">{mockStewardProfile.completedToday}</div>
                        <div className="text-xs text-muted-foreground">Completed</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-warning">
                          {Math.round(mockStewardProfile.completedToday / (mockStewardProfile.workload + mockStewardProfile.completedToday) * 100)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>;
};