'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  ar: { name: 'العربية', flag: '🇸🇦' }
};

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  // Get current locale from pathname
  const currentLocale = pathname.split('/')[1] as 'en' | 'fr' | 'ar' || 'en';
  
  const switchLanguage = (newLocale: string) => {
    // Set cookie to persist user's choice (matching middleware cookie name)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    
    // Remove current locale from pathname and add new one
    const pathWithoutLocale = pathname.split('/').slice(2).join('/');
    const newPath = `/${newLocale}/${pathWithoutLocale}`;
    
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md border bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors shadow-sm"
        aria-label="Select language"
      >
        <span className="text-lg">{languages[currentLocale]?.flag}</span>
        <span className="text-sm font-medium">{languages[currentLocale]?.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-50 min-w-[150px]">
          {Object.entries(languages).map(([locale, { name, flag }]) => (
            <button
              key={locale}
              onClick={() => switchLanguage(locale)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 first:rounded-t-md last:rounded-b-md transition-colors ${
                locale === currentLocale ? 'bg-gray-100' : ''
              }`}
            >
              <span className="text-lg">{flag}</span>
              <span className="text-sm">{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
