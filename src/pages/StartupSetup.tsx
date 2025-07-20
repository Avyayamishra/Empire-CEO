import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Building, MapPin, TrendingUp, Users, Megaphone, Lightbulb, HelpCircle, IndianRupee } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StartupData {
  businessName: string;
  city: string;
  businessType: string;
  productName: string;
  productPrice: number;
  budgetAllocation: {
    research: number;
    hr: number;
    marketing: number;
    operations: number;
  };
}

const cities = [
  { value: "mumbai", label: "Mumbai", rent: 50000, demand: "Very High", tax: "High" },
  { value: "delhi", label: "Delhi", rent: 45000, demand: "High", tax: "High" },
  { value: "bangalore", label: "Bangalore", rent: 40000, demand: "High", tax: "Medium" },
  { value: "pune", label: "Pune", rent: 30000, demand: "Medium", tax: "Medium" },
  { value: "ahmedabad", label: "Ahmedabad", rent: 25000, demand: "Medium", tax: "Low" }
];

const businessTypes = [
  { value: "sole-proprietorship", label: "Sole Proprietorship", complexity: "Simple", cost: "₹5,000" },
  { value: "partnership", label: "Partnership", complexity: "Medium", cost: "₹15,000" },
  { value: "private-limited", label: "Private Limited Company", complexity: "Complex", cost: "₹25,000" }
];

const StartupSetup = () => {
  const navigate = useNavigate();
  const [ceoProfile, setCeoProfile] = useState<any>(null);
  const [startupData, setStartupData] = useState<StartupData>({
    businessName: "",
    city: "",
    businessType: "",
    productName: "",
    productPrice: 100,
    budgetAllocation: {
      research: 25,
      hr: 25,
      marketing: 25,
      operations: 25
    }
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('empireCEO_profile');
    if (!savedProfile) {
      toast({
        title: "No CEO Profile Found",
        description: "Please create your CEO profile first.",
        variant: "destructive"
      });
      navigate('/create-ceo');
      return;
    }
    setCeoProfile(JSON.parse(savedProfile));
  }, [navigate]);

  const handleBudgetChange = (category: string, value: number[]) => {
    const newValue = value[0];
    const currentTotal = Object.values(startupData.budgetAllocation).reduce((sum, val) => sum + val, 0);
    const otherCategoriesTotal = currentTotal - startupData.budgetAllocation[category as keyof typeof startupData.budgetAllocation];
    
    if (otherCategoriesTotal + newValue <= 100) {
      setStartupData({
        ...startupData,
        budgetAllocation: {
          ...startupData.budgetAllocation,
          [category]: newValue
        }
      });
    }
  };

  const getTotalBudgetUsed = () => {
    return Object.values(startupData.budgetAllocation).reduce((sum, val) => sum + val, 0);
  };

  const handleStartBusiness = () => {
    if (!startupData.businessName || !startupData.city || !startupData.businessType || !startupData.productName) {
      toast({
        title: "Incomplete Setup",
        description: "Please fill in all required fields to start your business.",
        variant: "destructive"
      });
      return;
    }

    if (getTotalBudgetUsed() !== 100) {
      toast({
        title: "Budget Allocation Error",
        description: "Please allocate exactly 100% of your budget across all categories.",
        variant: "destructive"
      });
      return;
    }

    // Save startup data to localStorage
    const gameData = {
      ceoProfile,
      startup: startupData,
      gameState: {
        day: 1,
        cash: ceoProfile.startingCapital,
        employees: 1, // Just the CEO initially
        inventory: 0,
        revenue: 0,
        expenses: 0,
        customerSatisfaction: 50,
        employeeMorale: 70
      },
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('empireCEO_gameData', JSON.stringify(gameData));
    
    toast({
      title: "Business Registered Successfully!",
      description: `${startupData.businessName} is now ready to conquer the market!`,
    });

    navigate('/dashboard');
  };

  const selectedCity = cities.find(c => c.value === startupData.city);
  const selectedBusinessType = businessTypes.find(b => b.value === startupData.businessType);

  if (!ceoProfile) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-dashboard p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Setup Your Startup
          </h1>
          <p className="text-lg text-muted-foreground">
            Welcome, {ceoProfile.name}! Let's register your business and allocate your starting capital.
          </p>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <IndianRupee className="h-4 w-4 mr-1" />
            Available Capital: ₹{(ceoProfile.startingCapital / 100000).toFixed(1)}L
          </Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Business Registration */}
          <div className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Business Registration
                </CardTitle>
                <CardDescription>
                  Learn about different business structures (Class 11: Forms of Business Organization)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name *</Label>
                  <Input
                    id="business-name"
                    placeholder="Enter your business name"
                    value={startupData.businessName}
                    onChange={(e) => setStartupData({ ...startupData, businessName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Business Structure *</Label>
                  <Select value={startupData.businessType} onValueChange={(value) => setStartupData({ ...startupData, businessType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{type.label}</span>
                            <div className="flex gap-1 ml-2">
                              <Badge variant="outline" className="text-xs">{type.complexity}</Badge>
                              <Badge variant="secondary" className="text-xs">{type.cost}</Badge>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedBusinessType && (
                    <div className="p-3 bg-accent rounded-lg text-sm space-y-1">
                      <p><strong>Registration Cost:</strong> {selectedBusinessType.cost}</p>
                      <p><strong>Complexity:</strong> {selectedBusinessType.complexity}</p>
                      <p className="text-muted-foreground">
                        {selectedBusinessType.value === 'sole-proprietorship' && 'Single owner, unlimited liability, easy to start'}
                        {selectedBusinessType.value === 'partnership' && 'Multiple owners, shared liability, moderate complexity'}
                        {selectedBusinessType.value === 'private-limited' && 'Corporate entity, limited liability, complex compliance'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Business Location *</Label>
                  <Select value={startupData.city} onValueChange={(value) => setStartupData({ ...startupData, city: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{city.label}</span>
                            <Badge variant="outline" className="text-xs">₹{city.rent}/mo</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCity && (
                    <div className="p-3 bg-accent rounded-lg text-sm grid grid-cols-3 gap-2">
                      <div><strong>Rent:</strong> ₹{selectedCity.rent}/mo</div>
                      <div><strong>Demand:</strong> {selectedCity.demand}</div>
                      <div><strong>Tax Rate:</strong> {selectedCity.tax}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Product Details
                </CardTitle>
                <CardDescription>
                  Define your initial product/service offering
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product/Service Name *</Label>
                  <Input
                    id="product-name"
                    placeholder="What will you sell?"
                    value={startupData.productName}
                    onChange={(e) => setStartupData({ ...startupData, productName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Initial Price: ₹{startupData.productPrice}</Label>
                  <Slider
                    value={[startupData.productPrice]}
                    onValueChange={(value) => setStartupData({ ...startupData, productPrice: value[0] })}
                    max={1000}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹10 (Budget)</span>
                    <span>₹1,000 (Premium)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Allocation */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Budget Allocation
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Allocate your starting capital across different business functions. This teaches working capital management from Class 12.</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <CardDescription>
                Distribute your ₹{(ceoProfile.startingCapital / 100000).toFixed(1)}L across key business areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* R&D */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-warning" />
                      Research & Development: {startupData.budgetAllocation.research}%
                    </Label>
                    <Badge variant="outline">₹{((ceoProfile.startingCapital * startupData.budgetAllocation.research / 100) / 100000).toFixed(1)}L</Badge>
                  </div>
                  <Slider
                    value={[startupData.budgetAllocation.research]}
                    onValueChange={(value) => handleBudgetChange('research', value)}
                    max={70}
                    min={5}
                    step={5}
                  />
                  <p className="text-xs text-muted-foreground">Innovation, product development, and technology</p>
                </div>

                {/* HR */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Human Resources: {startupData.budgetAllocation.hr}%
                    </Label>
                    <Badge variant="outline">₹{((ceoProfile.startingCapital * startupData.budgetAllocation.hr / 100) / 100000).toFixed(1)}L</Badge>
                  </div>
                  <Slider
                    value={[startupData.budgetAllocation.hr]}
                    onValueChange={(value) => handleBudgetChange('hr', value)}
                    max={70}
                    min={5}
                    step={5}
                  />
                  <p className="text-xs text-muted-foreground">Hiring, training, salaries, and employee benefits</p>
                </div>

                {/* Marketing */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-success" />
                      Marketing: {startupData.budgetAllocation.marketing}%
                    </Label>
                    <Badge variant="outline">₹{((ceoProfile.startingCapital * startupData.budgetAllocation.marketing / 100) / 100000).toFixed(1)}L</Badge>
                  </div>
                  <Slider
                    value={[startupData.budgetAllocation.marketing]}
                    onValueChange={(value) => handleBudgetChange('marketing', value)}
                    max={70}
                    min={5}
                    step={5}
                  />
                  <p className="text-xs text-muted-foreground">Advertising, promotions, and customer acquisition</p>
                </div>

                {/* Operations */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-danger" />
                      Operations: {startupData.budgetAllocation.operations}%
                    </Label>
                    <Badge variant="outline">₹{((ceoProfile.startingCapital * startupData.budgetAllocation.operations / 100) / 100000).toFixed(1)}L</Badge>
                  </div>
                  <Slider
                    value={[startupData.budgetAllocation.operations]}
                    onValueChange={(value) => handleBudgetChange('operations', value)}
                    max={70}
                    min={5}
                    step={5}
                  />
                  <p className="text-xs text-muted-foreground">Rent, utilities, equipment, and day-to-day operations</p>
                </div>
              </div>

              <div className="p-4 bg-accent rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Total Allocated:</span>
                  <Badge variant={getTotalBudgetUsed() === 100 ? "default" : "destructive"}>
                    {getTotalBudgetUsed()}%
                  </Badge>
                </div>
                {getTotalBudgetUsed() !== 100 && (
                  <p className="text-sm text-danger">
                    Please allocate exactly 100% of your budget
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/create-ceo')}
            className="hover:shadow-medium transition-all duration-200"
          >
            Back to CEO Profile
          </Button>
          <Button 
            onClick={handleStartBusiness}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-200 px-8"
            disabled={!startupData.businessName || !startupData.city || !startupData.businessType || !startupData.productName || getTotalBudgetUsed() !== 100}
          >
            Register Business & Start
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartupSetup;