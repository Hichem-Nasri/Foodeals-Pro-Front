import type { Metadata } from 'next'
import { Montserrat, Cairo } from 'next/font/google'
import '@/styles/globals.css'
import QueryProvider from '@/components/layout/QueryProvider'
import { SessionProvider } from 'next-auth/react'
import Provider from '../provider'
import { NotificationProvider } from '@/context/NotifContext'
import { locales } from '@/i18n/config';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const cairo = Cairo({
  subsets: ['arabic'],
  weight: [ '200', '300', '400', '500', '600', '700', '800', '900'],
})

type Props = {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    en: 'Foodeals PRO',
    fr: 'Foodeals PRO',
    ar: 'فودديلز برو'
  };
  
  const descriptions = {
    en: 'Professional food management platform',
    fr: 'Plateforme professionnelle de gestion alimentaire', 
    ar: 'منصة إدارة الطعام المهنية'
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    icons: ['/favicon/pro.svg'],
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: RootLayoutProps) {
  const { locale } = await params;

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className='h-full'>
      <body className={`${locale === 'ar' ? cairo.className : montserrat.className} h-full`}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
