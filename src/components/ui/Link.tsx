'use client';

import { useLocale } from '@/hooks/useTranslations';
import NextLink from 'next/link';
import { ComponentProps } from 'react';

type LinkProps = ComponentProps<typeof NextLink>;

export function Link({ href, ...props }: LinkProps) {
  const locale = useLocale();
  
  // Add locale prefix to href if it doesn't already have one
  const localizedHref = href.toString().startsWith('/') && !href.toString().startsWith(`/${locale}`) 
    ? `/${locale}${href}`
    : href;
    
  return <NextLink href={localizedHref} {...props} />;
}
