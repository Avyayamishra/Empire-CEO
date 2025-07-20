import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Building2, 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  Calendar,
  Play,
  Pause,
  FastForward,
  Settings,
  HelpCircle,
  BarChart3,
  Briefcase
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface GameData {
  ceoProfile: any;
  startup: any;
  gameState: {
    day: number;
    cash: number;
    employees: number;
    inventory: number;
    revenue: number;
    expenses: number;
    customerSatisfaction: number;
    employeeMorale: number;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);

  useEffect(() => {
    const savedGame = localStorage.getItem('empireCEO_gameData');
    if (!savedGame) {
      toast({
        title: "No Game Data Found",
        description: "Please complete the startup setup first.",
        variant: "destructive"
      });
      navigate('/create-ceo');
      return;
    }
    setGameData(JSON.parse(savedGame));
  }, [navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && gameData) {
      interval = setInterval(() => {
        simulateGameDay();
      }, 3000 / gameSpeed); // Base speed: 3 seconds per day
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, gameSpeed, gameData]);

  const simulateGameDay = () => {
    if (!gameData) return;

    setGameData(prevData => {
      if (!prevData) return null;

      const newGameState = { ...prevData.gameState };
      
      // Calculate daily revenue based on various factors
      const baseRevenue = Math.floor(Math.random() * 10000) + 5000;
      const customerSatisfactionMultiplier = newGameState.customerSatisfaction / 100;
      const dailyRevenue = Math.floor(baseRevenue * customerSatisfactionMultiplier);
      
      // Calculate daily expenses
      const dailyExpenses = Math.floor(newGameState.employees * 2000) + 5000; // Employee costs + operational
      
      // Update game state
      newGameState.day += 1;
      newGameState.revenue += dailyRevenue;
      newGameState.expenses += dailyExpenses;
      newGameState.cash += (dailyRevenue - dailyExpenses);
      
      // Random events that affect satisfaction and morale
      if (Math.random() < 0.1) { // 10% chance of event
        const events = [
          { 
            message: "Customer complained about product quality!", 
            satisfaction: -5, 
            morale: 0 
          },
          { 
            message: "Great customer review received!", 
            satisfaction: 8, 
            morale: 3 
          },
          { 
            message: "Employee training program completed!", 
            satisfaction: 2, 
            morale: 10 
          },
          { 
            message: "Competitor launched similar product", 
            satisfaction: -3, 
            morale: -2 
          }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        newGameState.customerSatisfaction = Math.max(0, Math.min(100, newGameState.customerSatisfaction + event.satisfaction));
        newGameState.employeeMorale = Math.max(0, Math.min(100, newGameState.employeeMorale + event.morale));
        
        toast({
          title: `Day ${newGameState.day} Event`,
          description: event.message
        });
      }
      
      // Update inventory based on sales
      newGameState.inventory = Math.max(0, newGameState.inventory - Math.floor(dailyRevenue / prevData.startup.productPrice));
      
      const updatedData = {
        ...prevData,
        gameState: newGameState
      };
      
      // Save to localStorage
      localStorage.setItem('empireCEO_gameData', JSON.stringify(updatedData));
      
      return updatedData;
    });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Game Paused" : "Game Resumed",
      description: isPlaying ? "Business simulation paused" : "Business simulation resumed"
    });
  };

  const changeSpeed = () => {
    const newSpeed = gameSpeed === 1 ? 2 : gameSpeed === 2 ? 4 : 1;
    setGameSpeed(newSpeed);
    toast({
      title: "Game Speed Changed",
      description: `Speed set to ${newSpeed}x`
    });
  };

  const nextDay = () => {
    if (!isPlaying) {
      simulateGameDay();
    }
  };

  if (!gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { ceoProfile, startup, gameState } = gameData;
  const netProfit = gameState.revenue - gameState.expenses;
  const profitMargin = gameState.revenue > 0 ? ((netProfit / gameState.revenue) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">{startup.businessName}</h1>
            </div>
            <Badge variant="outline" className="text-sm">
              Day {gameState.day}
            </Badge>
            <Badge variant={netProfit >= 0 ? "default" : "destructive"}>
              {ceoProfile.personality.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={nextDay}
              disabled={isPlaying}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Next Day
            </Button>
            
            <Button
              variant={isPlaying ? "secondary" : "default"}
              size="sm"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Play
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={changeSpeed}
            >
              <FastForward className="h-4 w-4 mr-1" />
              {gameSpeed}x
            </Button>
            
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cash Balance</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{(gameState.cash / 100000).toFixed(1)}L
                  </p>
                </div>
                <IndianRupee className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Profit</p>
                  <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                    {netProfit >= 0 ? '+' : ''}₹{(netProfit / 100000).toFixed(1)}L
                  </p>
                </div>
                {netProfit >= 0 ? (
                  <TrendingUp className="h-8 w-8 text-success" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-danger" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Employees</p>
                  <p className="text-2xl font-bold text-foreground">
                    {gameState.employees}
                  </p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inventory</p>
                  <p className="text-2xl font-bold text-foreground">
                    {gameState.inventory}
                  </p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Financial Overview */}
          <Card className="lg:col-span-2 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Financial Overview
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">This shows your Profit & Loss statement in real-time, teaching you about revenue, expenses, and profitability - key concepts from Class 12 Financial Management.</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Revenue</span>
                    <span className="font-medium text-success">₹{(gameState.revenue / 100000).toFixed(1)}L</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Expenses</span>
                    <span className="font-medium text-danger">₹{(gameState.expenses / 100000).toFixed(1)}L</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </div>
              
              <div className="p-4 bg-accent rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Profit Margin</span>
                  <Badge variant={Number(profitMargin) >= 20 ? "default" : Number(profitMargin) >= 10 ? "secondary" : "destructive"}>
                    {profitMargin}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {Number(profitMargin) >= 20 && "Excellent! Your business is highly profitable."}
                  {Number(profitMargin) >= 10 && Number(profitMargin) < 20 && "Good profit margin. Room for improvement."}
                  {Number(profitMargin) < 10 && "Low profit margin. Consider optimizing costs or increasing prices."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Business Health */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Business Health
              </CardTitle>
              <CardDescription>
                Key performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                  <span className="font-medium">{gameState.customerSatisfaction}%</span>
                </div>
                <Progress 
                  value={gameState.customerSatisfaction} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  Affects sales and word-of-mouth marketing
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Employee Morale</span>
                  <span className="font-medium">{gameState.employeeMorale}%</span>
                </div>
                <Progress 
                  value={gameState.employeeMorale} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  High morale = better productivity & retention
                </p>
              </div>

              <div className="p-3 bg-accent rounded-lg">
                <h4 className="font-medium text-sm mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Hire Employee
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Order Inventory
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Marketing Campaign
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Your business structure and location details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Business Type</span>
                <Badge variant="outline">{startup.businessType.replace('-', ' ')}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="font-medium">{startup.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Main Product</span>
                <span className="font-medium">{startup.productName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Product Price</span>
                <span className="font-medium">₹{startup.productPrice}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>CEO Profile</CardTitle>
              <CardDescription>
                Your leadership strengths and background
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">CEO Name</span>
                <span className="font-medium">{ceoProfile.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Leadership Style</span>
                <Badge variant="secondary">{ceoProfile.personality.replace('-', ' ')}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Industry</span>
                <span className="font-medium">{ceoProfile.industry}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Experience</span>
                <span className="font-medium">{ceoProfile.experience}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;