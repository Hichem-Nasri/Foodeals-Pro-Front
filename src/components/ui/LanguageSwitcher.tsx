'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Locale, locales } from '@/i18n/config';
import { useLocale } from '@/hooks/useTranslations';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const localeNames = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية'
} as const;

const localeFlags: Record<Locale, string> = {
	en: 'us',
	fr: 'fr',
	ar: 'sa',
}
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    // Remove current locale from pathname and add new locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-auto flex items-center justify-center gap-0.5 h-12 bg-transparent border-none [&>.icon]:hidden text-lynch-500 p-2 flex-row">
        <SelectValue placeholder="Language" className='flex flex-row gap-0.5' />
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc} className="text-lynch-500 flex-row inline-flex  items-center w-full [&>.checked]:hidden pl-2 cursor-pointer [&>.checked]:w-0">
						<div className="flex flex-row w-full gap-1 items-center justify-center">

						<img
              src={`/icons/${localeFlags[loc]}.png`}
              alt={localeNames[loc]}
              width={20}
              height={20}
            />
            <span>
							{localeNames[loc]}
							</span>
							</div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
