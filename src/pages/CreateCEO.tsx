import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Building2, User, TrendingUp, Brain, Handshake, Shield, HelpCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CEOProfile {
  name: string;
  personality: string;
  industry: string;
  experience: string;
}

const personalities = [
  {
    id: "finance-wizard",
    name: "Finance Wizard",
    description: "Excellent at managing money, budgets, and investments",
    bonus: "+20% starting capital, +10% loan approval rates",
    icon: TrendingUp
  },
  {
    id: "innovator",
    name: "Tech Innovator", 
    description: "Great at R&D and developing new products",
    bonus: "+15% R&D efficiency, +25% product innovation speed",
    icon: Brain
  },
  {
    id: "people-person",
    name: "People Person",
    description: "Skilled at HR management and team building",
    bonus: "+20% employee satisfaction, -15% hiring costs",
    icon: Handshake
  },
  {
    id: "risk-manager",
    name: "Risk Manager",
    description: "Conservative approach, lower risk tolerance",
    bonus: "+25% insurance benefits, -20% crisis impact",
    icon: Shield
  }
];

const industries = [
  { value: "technology", label: "Technology", capital: "₹10L", demand: "High" },
  { value: "fashion", label: "Fashion & Retail", capital: "₹7L", demand: "Medium" },
  { value: "food", label: "Food & Beverage", capital: "₹5L", demand: "High" },
  { value: "consulting", label: "Consulting Services", capital: "₹8L", demand: "Medium" },
  { value: "manufacturing", label: "Manufacturing", capital: "₹12L", demand: "Medium" }
];

const CreateCEO = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CEOProfile>({
    name: "",
    personality: "",
    industry: "",
    experience: "fresher"
  });

  const handleCreateCEO = () => {
    if (!profile.name || !profile.personality || !profile.industry) {
      toast({
        title: "Incomplete Profile",
        description: "Please fill in all required fields to create your CEO profile.",
        variant: "destructive"
      });
      return;
    }

    // Calculate starting capital based on personality and industry
    const selectedIndustry = industries.find(i => i.value === profile.industry);
    const baseCapital = selectedIndustry ? parseInt(selectedIndustry.capital.replace('₹', '').replace('L', '')) * 100000 : 500000;
    
    let finalCapital = baseCapital;
    if (profile.personality === "finance-wizard") {
      finalCapital = Math.floor(baseCapital * 1.2);
    }

    // Save CEO profile to localStorage
    const ceoData = {
      ...profile,
      startingCapital: finalCapital,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('empireCEO_profile', JSON.stringify(ceoData));
    
    toast({
      title: "CEO Profile Created!",
      description: `Welcome, ${profile.name}! Ready to build your business empire?`,
    });

    navigate('/startup-setup');
  };

  const selectedPersonality = personalities.find(p => p.id === profile.personality);
  const selectedIndustry = industries.find(i => i.value === profile.industry);

  return (
    <div className="min-h-screen bg-gradient-dashboard p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Empire CEO
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create your CEO profile and start your journey from startup to business empire.
            Every decision will teach you real Commerce concepts!
          </p>
        </div>

        {/* CEO Creation Form */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Basic Info */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                CEO Profile
              </CardTitle>
              <CardDescription>
                Set up your business leader profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ceo-name">CEO Name *</Label>
                <Input
                  id="ceo-name"
                  placeholder="Enter your CEO name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="transition-all duration-200 focus:shadow-glow"
                />
              </div>

              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select value={profile.experience} onValueChange={(value) => setProfile({ ...profile, experience: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fresher">Fresh Graduate (CBSE Commerce)</SelectItem>
                    <SelectItem value="experienced">Some Business Experience</SelectItem>
                    <SelectItem value="expert">Business Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Industry Selection *</Label>
                <Select value={profile.industry} onValueChange={(value) => setProfile({ ...profile, industry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{industry.label}</span>
                          <Badge variant="outline" className="ml-2">{industry.capital}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedIndustry && (
                  <div className="p-3 bg-accent rounded-lg text-sm">
                    <p><strong>Starting Capital:</strong> {selectedIndustry.capital}</p>
                    <p><strong>Market Demand:</strong> {selectedIndustry.demand}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personality Selection */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Leadership Style *
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Your leadership style affects business decisions, employee morale, and strategic opportunities throughout the game.</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <CardDescription>
                Choose your management approach - this affects gameplay bonuses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {personalities.map((personality) => {
                const Icon = personality.icon;
                const isSelected = profile.personality === personality.id;
                return (
                  <div
                    key={personality.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-glow' 
                        : 'border-border hover:border-primary/50 hover:bg-accent/50'
                    }`}
                    onClick={() => setProfile({ ...profile, personality: personality.id })}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-1 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="space-y-1">
                        <h4 className="font-medium">{personality.name}</h4>
                        <p className="text-sm text-muted-foreground">{personality.description}</p>
                        <Badge variant={isSelected ? "default" : "secondary"} className="text-xs">
                          {personality.bonus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="hover:shadow-medium transition-all duration-200"
          >
            Back to Home
          </Button>
          <Button 
            onClick={handleCreateCEO}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-200 px-8"
            disabled={!profile.name || !profile.personality || !profile.industry}
          >
            Create CEO & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCEO;