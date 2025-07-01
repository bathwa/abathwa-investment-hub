
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'nd';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Landing page
    'landing.title': 'Abathwa Hub',
    'landing.subtitle': 'Connecting investors, entrepreneurs, and service providers in a secure, transparent ecosystem designed for growth.',
    'landing.cta': 'Get Started',
    'landing.features.secure.title': 'Secure & Trusted',
    'landing.features.secure.description': 'Bank-level security with multi-layer verification and escrow protection for all transactions.',
    'landing.features.transparent.title': 'Transparent Analytics',
    'landing.features.transparent.description': 'Real-time insights, progress tracking, and comprehensive reporting for informed decision-making.',
    'landing.features.community.title': 'Community Driven',
    'landing.features.community.description': 'Built on Ubuntu principles - we grow together through collaboration and mutual support.',
    
    // Roles
    'role.investor': 'Investors',
    'role.entrepreneur': 'Entrepreneurs',
    'role.serviceProvider': 'Service Providers',
    
    // Actions
    'action.signUp': 'Sign Up',
    'action.signIn': 'Sign In',
    'action.getStarted': 'Get Started',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.phoneNumber': 'Phone Number',
    'auth.selectRole': 'Select Role',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.createAccount': 'Create Account',
    'auth.welcomeBack': 'Welcome back! Please sign in to your account.',
    'auth.createYourAccount': 'Create your account to get started.',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
  nd: {
    // Landing page
    'landing.title': 'Abathwa Hub',
    'landing.subtitle': 'Sihlanganisa abatshalizimali, oosomabhizinisi, kanye nabahlinzeki bezidingo endaweni ephephile, ecacile eyenzelwe ukukhula.',
    'landing.cta': 'Qalisa',
    'landing.features.secure.title': 'Okuphephile Nokuthenjiweyo',
    'landing.features.secure.description': 'Ukuphepha kwebhange ngokuqinisekiswa okungamanani amaningi kanye nokuvikelwa kwe-escrow kuwo wonke umsebenzi.',
    'landing.features.transparent.title': 'Ukuhlaziya Okucacileyo',
    'landing.features.transparent.description': 'Ukubona okwesikhathi esiqondile, ukulandelela inqubekela phambili, kanye nembiko epheleleyo yokwenza izinqumo ezinolwazi.',
    'landing.features.community.title': 'Okuqhutshwa Umphakathi',
    'landing.features.community.description': 'Yakhelwe phezu kwemigomo ye-Ubuntu - sikhula ndawonye ngokubambisana nokusekelana.',
    
    // Roles
    'role.investor': 'Abatshalizimali',
    'role.entrepreneur': 'Oosomabhizinisi',
    'role.serviceProvider': 'Abahlinzeki Bezidingo',
    
    // Actions
    'action.signUp': 'Bhalisa',
    'action.signIn': 'Ngena',
    'action.getStarted': 'Qalisa',
    
    // Auth
    'auth.email': 'I-email',
    'auth.password': 'Iphasiwedi',
    'auth.confirmPassword': 'Qinisekisa Iphasiwedi',
    'auth.firstName': 'Igama Lokuqala',
    'auth.lastName': 'Isibongo',
    'auth.phoneNumber': 'Inombolo Yocingo',
    'auth.selectRole': 'Khetha Indima',
    'auth.forgotPassword': 'Ukhohlwe Iphasiwedi?',
    'auth.alreadyHaveAccount': 'Usunale-akhawunti?',
    'auth.dontHaveAccount': 'Awunale-akhawunti?',
    'auth.createAccount': 'Dala I-akhawunti',
    'auth.welcomeBack': 'Siyakwamukela! Sicela ufake imininingwane yakho.',
    'auth.createYourAccount': 'Dala i-akhawunti yakho ukuze uqalise.',
    
    // Common
    'common.loading': 'Kulayishwa...',
    'common.error': 'Iphutha',
    'common.success': 'Impumelelo',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
