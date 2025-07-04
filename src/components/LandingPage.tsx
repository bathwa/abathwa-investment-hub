
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from './AuthModal';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  TrendingUp, 
  Shield, 
  Users, 
  Building, 
  Handshake,
  ArrowRight,
  Target,
  Zap,
  Globe,
  Sparkles,
  Rocket,
  Lock,
  Wifi,
  WifiOff,
  Smartphone
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Network status monitoring for offline-first approach
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const features = [
    {
      icon: Shield,
      title: t('landing.features.secure.title'),
      description: t('landing.features.secure.description'),
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: TrendingUp,
      title: t('landing.features.transparent.title'),
      description: t('landing.features.transparent.description'),
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: Users,
      title: t('landing.features.community.title'),
      description: t('landing.features.community.description'),
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    }
  ];

  const roles = [
    {
      icon: Target,
      title: t('role.investor'),
      description: 'Discover authentic opportunities, form investment circles, and grow wealth together with advanced analytics.',
      color: "text-primary",
      bgColor: "bg-primary/10",
      badge: "Popular",
      badgeColor: "bg-primary"
    },
    {
      icon: Zap,
      title: t('role.entrepreneur'),
      description: 'Showcase your vision, connect with investors, and build your business with community support and smart matching.',
      color: "text-accent",
      bgColor: "bg-accent/10",
      badge: "Growing",
      badgeColor: "bg-accent"
    },
    {
      icon: Handshake,
      title: t('role.serviceProvider'),
      description: 'Offer your expertise, build trust through co-signing, and grow your professional network in our ecosystem.',
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      badge: "Trusted",
      badgeColor: "bg-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-amber-900/20">
      {/* Network Status Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 h-1 ${isOnline ? 'bg-green-500' : 'bg-red-500'} transition-colors duration-300`}></div>
      
      {/* Header */}
      <header className="border-b border-primary/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl sticky top-1 z-40 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 african-gradient rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <Building className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">{t('landing.title')}</h1>
                <p className="text-xs text-muted-foreground font-medium">Investment Community</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Network Status Indicator */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              
              <LanguageToggle />
              <ThemeToggle />
              <Button 
                variant="outline" 
                onClick={() => setIsAuthModalOpen(true)}
                className="btn-secondary font-medium"
              >
                {t('action.signIn')}
              </Button>
              <Button 
                onClick={() => setIsAuthModalOpen(true)}
                className="btn-primary font-semibold"
              >
                {t('landing.cta')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 african-gradient overflow-hidden relative">
        <div className="absolute inset-0 traditional-pattern opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-8 fade-in-fast">
              <Sparkles className="w-4 h-4 text-white mr-2" />
              <span className="text-white/90 text-sm font-medium">Proudly African • Built for Africa</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t('landing.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
              {t('landing.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-white text-gray-900 hover:bg-gray-100 border-0 px-8 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-xl"
              >
                <Rocket className="w-5 h-5 mr-3" />
                {t('landing.cta')}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setIsAuthModalOpen(true)}
                className="border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <Lock className="w-5 h-5 mr-3" />
                {t('action.signIn')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gradient">Why Choose Abathwa Investment Hub?</h2>
            <div className="w-20 h-1 african-gradient mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card card-hover border-0 group">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-orange-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gradient">Built for Every Member of Our Community</h2>
            <div className="w-20 h-1 ubuntu-gradient mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {roles.map((role, index) => (
              <Card key={index} className="glass-card card-hover border-0 relative group">
                <CardHeader className="text-center pb-4">
                  <Badge className={`absolute top-4 right-4 ${role.badgeColor} text-white border-0 shadow-lg font-semibold px-3 py-1`}>
                    {role.badge}
                  </Badge>
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${role.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <role.icon className={`w-8 h-8 ${role.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold">{role.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                    {role.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-12 h-12 mx-auto mb-6 african-gradient rounded-xl flex items-center justify-center animate-float">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-6 text-gradient">Our Ubuntu Mission</h2>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 font-light">
              To democratize investment opportunities through technology, transparency, and Ubuntu - the belief that we are all connected.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="african-gradient text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Abathwa Hub</h3>
                  <p className="text-sm text-white/80">Investment Community</p>
                </div>
              </div>
              <p className="text-white/90 leading-relaxed">
                To democratize investment opportunities through technology, transparency, and Ubuntu.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Contact Us</h4>
              <div className="space-y-3 text-white/90">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-4 h-4" />
                  <span>+263 78 998 9619</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4" />
                  <span>admin@abathwa-hub.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-6 text-center">
            <p className="text-white/80">&copy; 2024 Abathwa Investment Hub. Built with Ubuntu spirit.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
};
