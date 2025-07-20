import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Target, 
  Award,
  Play,
  Sparkles,
  GraduationCap,
  BarChart3
} from "lucide-react";
import heroImage from "@/assets/hero-business.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [existingGame, setExistingGame] = useState<any>(null);

  useEffect(() => {
    const savedGame = localStorage.getItem('empireCEO_gameData');
    if (savedGame) {
      setExistingGame(JSON.parse(savedGame));
    }
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "CBSE Commerce Learning",
      description: "Learn Class 11 & 12 concepts through practical business scenarios",
      topics: ["Business Organizations", "Financial Management", "Marketing", "HR Management"]
    },
    {
      icon: TrendingUp,
      title: "Real Business Simulation",
      description: "Make decisions like a real CEO - from startup to enterprise",
      topics: ["Budget Allocation", "Market Analysis", "Strategic Planning", "Risk Management"]
    },
    {
      icon: Users,
      title: "Interactive Gameplay",
      description: "Manage employees, customers, and stakeholders effectively",
      topics: ["Team Building", "Customer Satisfaction", "Stakeholder Relations", "Performance Metrics"]
    },
    {
      icon: Award,
      title: "Progress Tracking",
      description: "Monitor your business empire growth with detailed analytics",
      topics: ["P&L Statements", "Balance Sheets", "KPI Dashboards", "Growth Metrics"]
    }
  ];

  const gameHighlights = [
    "Start with ₹5L-₹12L seed funding based on your profile",
    "Choose from 5+ business structures and industries", 
    "Real-time financial simulation with daily P&L",
    "Educational tooltips explaining Commerce concepts",
    "Dynamic events teaching business crisis management",
    "Progress from startup to business empire"
  ];

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Business simulation environment" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Building2 className="h-12 w-12 text-primary animate-pulse-glow" />
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Empire CEO
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Master real-world business skills through an interactive simulation game. 
              Learn CBSE Commerce concepts while building your business empire from startup to industry leader.
            </p>
            
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="text-lg px-4 py-2">
                <GraduationCap className="h-4 w-4 mr-2" />
                CBSE Class 11 & 12 Commerce
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                <BarChart3 className="h-4 w-4 mr-2" />
                Real Business Simulation
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Interactive Learning
              </Badge>
            </div>
            
            <div className="flex items-center justify-center gap-4 pt-8">
              {existingGame ? (
                <div className="flex items-center gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/dashboard')}
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8 py-4 text-lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Continue Game (Day {existingGame.gameState?.day || 1})
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => {
                      localStorage.clear();
                      navigate('/create-ceo');
                    }}
                    className="hover:shadow-medium transition-all duration-300 px-8 py-4 text-lg"
                  >
                    Start New Game
                  </Button>
                </div>
              ) : (
                <Button 
                  size="lg" 
                  onClick={() => navigate('/create-ceo')}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8 py-4 text-lg animate-pulse-glow"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Your CEO Journey
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Learn Commerce Through Gaming</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every business decision you make teaches real CBSE Commerce concepts in a practical, engaging way.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="text-center">
                    <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-muted-foreground">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Game Highlights */}
      <section className="py-20 px-6 bg-accent/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Empire CEO?</h2>
            <p className="text-lg text-muted-foreground">
              Experience the most realistic business simulation designed for CBSE Commerce students.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Game Features
              </h3>
              <div className="space-y-4">
                {gameHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="shadow-medium bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Educational Value
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Every game mechanic is built around CBSE Commerce curriculum:
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-medium">Class 11 Topics</h4>
                    <div className="space-y-1 text-muted-foreground">
                      <p>• Business Organizations</p>
                      <p>• Sources of Finance</p>
                      <p>• Business Services</p>
                      <p>• Internal Trade</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Class 12 Topics</h4>
                    <div className="space-y-1 text-muted-foreground">
                      <p>• Management Principles</p>
                      <p>• Financial Management</p>
                      <p>• Marketing Management</p>
                      <p>• Human Resources</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Business Empire?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of students learning Commerce through practical business simulation.
          </p>
          
          {!existingGame && (
            <Button 
              size="lg" 
              onClick={() => navigate('/create-ceo')}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-12 py-4 text-lg"
            >
              <Building2 className="h-5 w-5 mr-2" />
              Start Your CEO Journey Now
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
