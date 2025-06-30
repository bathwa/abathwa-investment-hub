
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'nd';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys and values
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.opportunities': 'Opportunities',
    'nav.investments': 'My Investments',
    'nav.pools': 'Investment Pools',
    'nav.serviceProviders': 'Service Providers',
    'nav.reports': 'Reports',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.users': 'User Management',
    
    // Common actions
    'action.signIn': 'Sign In',
    'action.signUp': 'Sign Up',
    'action.create': 'Create',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.submit': 'Submit',
    'action.viewDetails': 'View Details',
    
    // Landing page
    'landing.title': 'Abathwa Investment Hub',
    'landing.subtitle': 'Connecting investors, entrepreneurs, and communities through traditional values and modern technology.',
    'landing.cta': 'Join Our Community',
    'landing.features.secure.title': 'Ubuntu Security',
    'landing.features.secure.description': 'Your investments protected with community-driven security and traditional trust principles.',
    'landing.features.transparent.title': 'Complete Transparency',
    'landing.features.transparent.description': 'Track every investment with full visibility, honoring our commitment to openness.',
    'landing.features.community.title': 'Strong Community',
    'landing.features.community.description': 'Join a network building wealth together through Ubuntu principles.',
    
    // Auth
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.phoneNumber': 'Phone Number',
    'auth.organization': 'Organization Name (Optional)',
    'auth.role': 'Role',
    'auth.forgotPassword': 'Forgot Password?',
    
    // Roles
    'role.investor': 'Investor',
    'role.entrepreneur': 'Entrepreneur',
    'role.serviceProvider': 'Service Provider',
    'role.observer': 'Observer',
    'role.admin': 'Administrator',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.overview': 'Overview',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.quickActions': 'Quick Actions',
  },
  nd: {
    // Navigation
    'nav.dashboard': 'I-Dashboard',
    'nav.opportunities': 'Amathuba',
    'nav.investments': 'Utyalo-mali Lwami',
    'nav.pools': 'Amaqela Otyalo-mali',
    'nav.serviceProviders': 'Ababoneleli Benkonzo',
    'nav.reports': 'Imibiko',
    'nav.profile': 'Iprofayile',
    'nav.settings': 'Izilungiselelo',
    'nav.users': 'Ukuphathwa Kwabasebenzisi',
    
    // Common actions
    'action.signIn': 'Ngena',
    'action.signUp': 'Zibhalise',
    'action.create': 'Dala',
    'action.edit': 'Hlela',
    'action.delete': 'Susa',
    'action.save': 'Gcina',
    'action.cancel': 'Yeka',
    'action.submit': 'Thumela',
    'action.viewDetails': 'Bona Imininingwane',
    
    // Landing page
    'landing.title': 'Abathwa Investment Hub',
    'landing.subtitle': 'Ukudibanisa abatyali-mali, oosomashishini, noluntu ngokusebenzisa izithethe zemveli nobuchwepheshe banamhlanje.',
    'landing.cta': 'Zijoyine Uluntu Lwethu',
    'landing.features.secure.title': 'Ukhuseleko Lwe-Ubuntu',
    'landing.features.secure.description': 'Utyalo-mali lwakho lukhuselelwe ngokhuseleko oluqhutywa luluntu kunye nemithetho yothemba lwemveli.',
    'landing.features.transparent.title': 'Ukubonakala Okupheleleyo',
    'landing.features.transparent.description': 'Landela lonke utyalo-mali ngokubona okupheleleyo, sihlonipha isibophelelo sethu sokuvula.',
    'landing.features.community.title': 'Uluntu Olomeleleyo',
    'landing.features.community.description': 'Zijoyine kwiqonga abakha ubutyebi kunye ngokusebenzisa imigaqo ye-Ubuntu.',
    
    // Auth
    'auth.email': 'Idilesi Ye-imeyili',
    'auth.password': 'Iphaswedi',
    'auth.confirmPassword': 'Qinisekisa Iphaswedi',
    'auth.firstName': 'Igama Lokuqala',
    'auth.lastName': 'Ifani',
    'auth.phoneNumber': 'Inombolo Yefoni',
    'auth.organization': 'Igama Lenhlanganiso (Akusiyo Impoqo)',
    'auth.role': 'Indima',
    'auth.forgotPassword': 'Ukhohlwe Iphaswedi?',
    
    // Roles
    'role.investor': 'Umtyali-mali',
    'role.entrepreneur': 'Usomashishini',
    'role.serviceProvider': 'Umoneleli Wenkonzo',
    'role.observer': 'Umbuki',
    'role.admin': 'Umlawuli',
    
    // Dashboard
    'dashboard.welcome': 'Siyakwamukela futhi',
    'dashboard.overview': 'Isifinyezo',
    'dashboard.recentActivity': 'Imisebenzi Yakamuva',
    'dashboard.quickActions': 'Izenzo Ezikhawuleza',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'nd')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
