
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageToggleProps {
  language?: 'en' | 'nd';
  onLanguageChange?: (language: 'en' | 'nd') => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  language = 'en', 
  onLanguageChange 
}) => {
  const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    nd: { name: 'isiNdebele', flag: '🇿🇼' }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="border-2">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border-2">
        {Object.entries(languages).map(([code, lang]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => onLanguageChange?.(code as 'en' | 'nd')}
            className={`cursor-pointer ${language === code ? 'bg-muted' : ''}`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
