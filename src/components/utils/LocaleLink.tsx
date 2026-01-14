'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LocaleLinkProps {
  href: string;
  locale?: 'en' | 'fr' | 'ar';
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export default function LocaleLink({ 
  href, 
  locale, 
  children, 
  className,
  ...props 
}: LocaleLinkProps) {
  const pathname = usePathname();
  
  // Get current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'en';
  const targetLocale = locale || currentLocale;
  
  // Ensure href starts with locale
  const localizedHref = href.startsWith('/') 
    ? `/${targetLocale}${href}` 
    : `/${targetLocale}/${href}`;

  return (
    <Link href={localizedHref} className={className} {...props}>
      {children}
    </Link>
  );
}
