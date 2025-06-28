
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from './AuthModal';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { 
  Star, 
  TrendingUp, 
  Shield, 
  Users, 
  Building, 
  Handshake,
  CheckCircle,
  ArrowRight,
  Globe,
  Target,
  Zap
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
        description: "Your investments and data are protected with enterprise-level security protocols."
      },
      transparent: {
        title: "Complete Transparency",
        description: "Track every investment, milestone, and transaction with full visibility."
      },
      community: {
        title: "Thriving Community",
        description: "Join a network of successful investors, entrepreneurs, and service providers."
      }
    },
    roles: {
      title: "Built for Every Stakeholder",
      investor: {
        title: "Investors",
        description: "Discover vetted opportunities, form investment pools, and track your portfolio with advanced analytics."
      },
      entrepreneur: {
        title: "Entrepreneurs",
        description: "Showcase your ventures, connect with investors, and manage your funding journey seamlessly."
      },
      serviceProvider: {
        title: "Service Providers",
        description: "Offer your expertise, co-sign agreements, and build your professional network."
      }
    },
    stats: {
      investments: "Active Investments",
      entrepreneurs: "Entrepreneurs",
      returns: "Average Returns"
    },
    testimonials: {
      title: "Trusted by Innovators",
      testimonial1: "Abathwa transformed how we approach investment opportunities in Africa. The platform's transparency and security gave us the confidence to expand our portfolio significantly.",
      author1: "Sarah Mukamuri, Investment Manager",
      testimonial2: "As an entrepreneur, finding the right investors was always challenging. Abathwa made it seamless to connect with serious investors who understand our market.",
      author2: "David Moyo, Tech Entrepreneur"
    },
    footer: {
      mission: "Mission",
      missionText: "To democratize investment opportunities across Africa through technology, transparency, and community.",
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
        description: "Utyalo-mali lwakho nedatha yakho zikhuselelwe ngeenkqubo zokhuseleko zoshishino."
      },
      transparent: {
        title: "Ukubonakala Okupheleleyo",
        description: "Landela lonke utyalo-mali, izinto ezibalulekileyo, nengeniso ngokubona okupheleleyo."
      },
      community: {
        title: "Uluntu Oluphumeleleyo",
        description: "Zijoyine kwiqonga labatyali-mali abaphumeleleyo, oosomashishini nababoneleli benkonzo."
      }
    },
    roles: {
      title: "Yenzelwe Bonke Ababandakanyekayo",
      investor: {
        title: "Abatyali-mali",
        description: "Fumana amathuba aqinisekisiweyo, wenze amaqela otyalo-mali, ulandele ipotifoliyo yakho ngeengcaciso eziphambili."
      },
      entrepreneur: {
        title: "Oosomashishini",
        description: "Bonisa amashishini akho, unxibelelane nabatyali-mali, ulawule uhambo lwakho lokufumana imali ngokuphandle."
      },
      serviceProvider: {
        title: "Ababoneleli Benkonzo",
        description: "Nikela ngobuchule bakho, tyikitya izivumelwano, wakhe iqonga lakho lobuchwepheshe."
      }
    },
    stats: {
      investments: "Utyalo-mali Olusebenzayo",
      entrepreneurs: "Oosomashishini",
      returns: "Imbuyekezo Ephakathi"
    },
    testimonials: {
      title: "Ithenjwe Zizinto Ezintsha",
      testimonial1: "I-Abathwa yaguqula indlela esisondela ngayo kumathuba otyalo-mali e-Afrika. Ukubonakala kweqonga nokhuseleko kwasikwenzelisa ukubetha isandla ukuze siwandise ipotifoliyo yethu kakhulu.",
      author1: "Sarah Mukamuri, Umphathi Wotyalo-mali",
      testimonial2: "Njengomntu oshinyayo, ukufumana abatyali-mali abafanelekileyo kwakusoloko kuyinkathazo. I-Abathwa yayenza yaba lula ukudibana nabatyali-mali abazimiseleyo abaqonda imarike yethu.",
      author2: "David Moyo, Umsomashishini Wezobuchwepheshe"
    },
    footer: {
      mission: "Injongo",
      missionText: "Ukwenza amathuba otyalo-mali e-Afrika abe lula kuye wonke umntu ngezobuchwepheshe, ukubonakala, noluntu.",
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
      color: "text-green-600"
    },
    {
      icon: TrendingUp,
      title: t.features.transparent.title,
      description: t.features.transparent.description,
      color: "text-blue-600"
    },
    {
      icon: Users,
      title: t.features.community.title,
      description: t.features.community.description,
      color: "text-purple-600"
    }
  ];

  const roles = [
    {
      icon: Target,
      title: t.roles.investor.title,
      description: t.roles.investor.description,
      color: "text-green-600",
      badge: "Popular"
    },
    {
      icon: Zap,
      title: t.roles.entrepreneur.title,
      description: t.roles.entrepreneur.description,
      color: "text-orange-600",
      badge: "Growth"
    },
    {
      icon: Handshake,
      title: t.roles.serviceProvider.title,
      description: t.roles.serviceProvider.description,
      color: "text-teal-600",
      badge: "Professional"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 investment-gradient rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Abathwa</h1>
                <p className="text-xs text-muted-foreground">Investment Hub</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <ThemeToggle />
              <Button 
                variant="outline" 
                onClick={() => setAuthModal('signIn')}
                className="btn-secondary"
              >
                {t.hero.signIn}
              </Button>
              <Button 
                onClick={() => setAuthModal('signUp')}
                className="btn-primary"
              >
                {t.hero.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={() => setAuthModal('signUp')}
                className="bg-white text-primary hover:bg-white/90 border-2 border-white px-8 py-3 text-lg font-semibold"
              >
                {t.hero.cta}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setAuthModal('signIn')}
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
              >
                {t.hero.signIn}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">250+</div>
              <div className="text-muted-foreground">{t.stats.investments}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground">{t.stats.entrepreneurs}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24%</div>
              <div className="text-muted-foreground">{t.stats.returns}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.features.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover border-2">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-background border-2 flex items-center justify-center mb-4 ${feature.color}`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.roles.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {roles.map((role, index) => (
              <Card key={index} className="card-hover border-2 relative">
                <CardHeader className="text-center pb-4">
                  <Badge className="absolute top-4 right-4 bg-primary/10 text-primary border-primary/20">
                    {role.badge}
                  </Badge>
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-background border-2 flex items-center justify-center mb-4 ${role.color}`}>
                    <role.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {role.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.testimonials.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="card-hover border-2">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed mb-6 italic">
                  "{t.testimonials.testimonial1}"
                </p>
                <div className="font-semibold">— {t.testimonials.author1}</div>
              </CardContent>
            </Card>
            <Card className="card-hover border-2">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed mb-6 italic">
                  "{t.testimonials.testimonial2}"
                </p>
                <div className="font-semibold">— {t.testimonials.author2}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 investment-gradient rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Abathwa</h3>
                  <p className="text-sm text-muted-foreground">Investment Hub</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t.footer.mission}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {t.footer.missionText}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t.footer.support}</h4>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{t.footer.phone}:</span>
                  <span>+263 78 998 9619</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{t.footer.email}:</span>
                  <span>admin@abathwa.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{t.footer.whatsapp}:</span>
                  <span>wa.me/789989619</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto font-normal text-muted-foreground hover:text-primary"
                  onClick={() => setAuthModal('signUp')}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Abathwa Investment Hub. All rights reserved.</p>
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
