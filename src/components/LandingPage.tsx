
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from './AuthModal';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
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
  Lock
} from 'lucide-react';

interface LandingPageProps {
  language: 'en' | 'nd';
}

const translations = {
  en: {
    hero: {
      title: "Empowering African Investment & Innovation",
      subtitle: "Connect investors, entrepreneurs, and service providers in a secure, transparent ecosystem designed for growth.",
      cta: "Get Started Today",
      signIn: "Sign In"
    },
    features: {
      title: "Why Choose Abathwa Investment Hub?",
      secure: {
        title: "Bank-Grade Security",
        description: "Your investments and data are protected with enterprise-level security protocols and end-to-end encryption."
      },
      transparent: {
        title: "Complete Transparency",
        description: "Track every investment, milestone, and transaction with full visibility and real-time reporting."
      },
      community: {
        title: "Thriving Community",
        description: "Join a network of forward-thinking investors, entrepreneurs, and service providers across Africa."
      }
    },
    roles: {
      title: "Built for Every Stakeholder",
      investor: {
        title: "Investors",
        description: "Discover vetted opportunities, form investment pools, and track your portfolio with advanced analytics and AI-powered insights."
      },
      entrepreneur: {
        title: "Entrepreneurs",
        description: "Showcase your ventures, connect with investors, and manage your funding journey with intelligent matching algorithms."
      },
      serviceProvider: {
        title: "Service Providers",
        description: "Offer your expertise, co-sign agreements, and build your professional network within our trusted ecosystem."
      }
    },
    mission: {
      title: "Our Mission",
      description: "To democratize investment opportunities across Africa through technology, transparency, and community-driven innovation."
    },
    footer: {
      support: "Support",
      phone: "Phone",
      email: "Email",
      whatsapp: "WhatsApp"
    }
  },
  nd: {
    hero: {
      title: "Ukuqinisa Utyalo-mali Nakuphuhlisa e-Afrika",
      subtitle: "Ukuhlanganisa abatyali-mali, oosomashishini, nababoneleli benkonzo kwindawo ekhuselekileyo nekhangelekayo eyenzelwe ukukhula.",
      cta: "Qalisa Namhlanje",
      signIn: "Ngena"
    },
    features: {
      title: "Kutheni Ukhetha i-Abathwa Investment Hub?",
      secure: {
        title: "Ukhuseleko Lwasebhankini",
        description: "Utyalo-mali lwakho nedatha yakho zikhuselelwe ngeenkqubo zokhuseleko zoshishino kunye nokhuseleko oluphezulu."
      },
      transparent: {
        title: "Ukubonakala Okupheleleyo",
        description: "Landela lonke utyalo-mali, izinto ezibalulekileyo, nengeniso ngokubona okupheleleyo kunye neengxelo zexeshana."
      },
      community: {
        title: "Uluntu Oluphumeleleyo",
        description: "Zijoyine kwiqonga labatyali-mali abacingayo phambili, oosomashishini nababoneleli benkonzo kulo lonke elaseAfrika."
      }
    },
    roles: {
      title: "Yenzelwe Bonke Ababandakanyekayo",
      investor: {
        title: "Abatyali-mali",
        description: "Fumana amathuba aqinisekisiweyo, wenze amaqela otyalo-mali, ulandele ipotifoliyo yakho ngeengcaciso eziphambili kunye nezixhobo ze-AI."
      },
      entrepreneur: {
        title: "Oosomashishini",
        description: "Bonisa amashishini akho, unxibelelane nabatyali-mali, ulawule uhambo lwakho lokufumana imali ngeenkqubo zokudibanisa ezikrelekrele."
      },
      serviceProvider: {
        title: "Ababoneleli Benkonzo",
        description: "Nikela ngobuchule bakho, tyikitya izivumelwano, wakhe iqonga lakho lobuchwepheshe ngaphakathi kwindawo yethu ethenjwayo."
      }
    },
    mission: {
      title: "Injongo Yethu",
      description: "Ukwenza amathuba otyalo-mali e-Afrika abe lula kuye wonke umntu ngezobuchwepheshe, ukubonakala, kunye nophuhliso oluqhutywa luluntu."
    },
    footer: {
      support: "Inkxaso",
      phone: "Ifowuni",
      email: "I-imeyili",
      whatsapp: "I-WhatsApp"
    }
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ language }) => {
  const [authModal, setAuthModal] = useState<'signIn' | 'signUp' | null>(null);
  const t = translations[language];

  const features = [
    {
      icon: Shield,
      title: t.features.secure.title,
      description: t.features.secure.description,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      icon: TrendingUp,
      title: t.features.transparent.title,
      description: t.features.transparent.description,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: Users,
      title: t.features.community.title,
      description: t.features.community.description,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    }
  ];

  const roles = [
    {
      icon: Target,
      title: t.roles.investor.title,
      description: t.roles.investor.description,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      badge: "Popular",
      badgeColor: "bg-blue-500"
    },
    {
      icon: Zap,
      title: t.roles.entrepreneur.title,
      description: t.roles.entrepreneur.description,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      badge: "Growth",
      badgeColor: "bg-orange-500"
    },
    {
      icon: Handshake,
      title: t.roles.serviceProvider.title,
      description: t.roles.serviceProvider.description,
      color: "text-teal-500",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      badge: "Professional",
      badgeColor: "bg-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 modern-gradient rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <Building className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Abathwa</h1>
                <p className="text-xs text-muted-foreground font-medium">Investment Hub</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <ThemeToggle />
              <Button 
                variant="outline" 
                onClick={() => setAuthModal('signIn')}
                className="btn-secondary font-medium"
              >
                {t.hero.signIn}
              </Button>
              <Button 
                onClick={() => setAuthModal('signUp')}
                className="btn-primary font-semibold"
              >
                {t.hero.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 hero-gradient overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-8">
              <Sparkles className="w-4 h-4 text-white mr-2" />
              <span className="text-white/90 text-sm font-medium">Revolutionizing African Investment</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                onClick={() => setAuthModal('signUp')}
                className="bg-white text-gray-900 hover:bg-gray-100 border-0 px-12 py-4 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-2xl"
              >
                <Rocket className="w-5 h-5 mr-3" />
                {t.hero.cta}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setAuthModal('signIn')}
                className="border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm px-12 py-4 text-xl font-semibold rounded-2xl"
              >
                <Lock className="w-5 h-5 mr-3" />
                {t.hero.signIn}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-gradient">{t.features.title}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card card-hover border-0 group">
                <CardHeader className="text-center pb-6">
                  <div className={`w-20 h-20 mx-auto rounded-3xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-10 h-10 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-gradient">{t.roles.title}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {roles.map((role, index) => (
              <Card key={index} className="glass-card card-hover border-0 relative group">
                <CardHeader className="text-center pb-6">
                  <Badge className={`absolute top-6 right-6 ${role.badgeColor} text-white border-0 shadow-lg font-semibold px-3 py-1`}>
                    {role.badge}
                  </Badge>
                  <div className={`w-20 h-20 mx-auto rounded-3xl ${role.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <role.icon className={`w-10 h-10 ${role.color}`} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{role.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                    {role.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-8 modern-gradient rounded-2xl flex items-center justify-center animate-float">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-8 text-gradient">{t.mission.title}</h2>
            <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300 font-light">
              {t.mission.description}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 modern-gradient rounded-2xl flex items-center justify-center shadow-lg">
                  <Building className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Abathwa</h3>
                  <p className="text-sm text-gray-300">Investment Hub</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                {t.mission.description}
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-xl">{t.footer.support}</h4>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-white">{t.footer.phone}:</span>
                  <span className="text-lg">+263 78 998 9619</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-white">{t.footer.email}:</span>
                  <span className="text-lg">admin@abathwa.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-white">{t.footer.whatsapp}:</span>
                  <span className="text-lg">wa.me/789989619</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 Abathwa Investment Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {authModal && (
        <AuthModal 
          type={authModal} 
          onClose={() => setAuthModal(null)}
          language={language}
        />
      )}
    </div>
  );
};
