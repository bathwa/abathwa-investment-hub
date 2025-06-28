
import React, { useState } from 'react';
import { LandingPage } from '@/components/LandingPage';

const Index = () => {
  const [language, setLanguage] = useState<'en' | 'nd'>('en');

  return <LandingPage language={language} />;
};

export default Index;
