import type { Metadata, Viewport } from "next";
import { Inter, Reem_Kufi } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import Navigation from "@/components/layout/Navigation";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import WelcomeModal from "@/components/WelcomeModal";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const kufi = Reem_Kufi({
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kufi",
});

export const metadata: Metadata = {
  title: "Coran 40 Jours - Défi Lecture & Tafsir",
  description: "Complétez la lecture du Coran en 40 jours avec Tafsir Ibn Kathir et 99 Noms d'Allah.",
  manifest: "/manifest.json",
  // Sans icône Apple déclarée, Safari iOS demande /apple-touch-icon*.png à chaque visite (404)
  icons: { apple: "/apple-touch-icon.png" },
};

// viewport-fit=cover active env(safe-area-inset-*) sur iPhone (utilisé par pb-safe)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFBF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

const THEME_INIT_SCRIPT = `try{var d=document.documentElement,t=localStorage.getItem('theme'),f=localStorage.getItem('fontSize');if(t){d.setAttribute('data-theme',t);if(t==='dark')d.classList.add('dark')}if(f)d.setAttribute('data-font-size',f)}catch(e){}`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Applique thème et taille de police avant le premier rendu, sans attendre que le JS
            de l'app soit chargé (SettingsContext ne le fait qu'après l'hydratation). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${kufi.variable} antialiased font-sans bg-background text-foreground`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navigation />
            <PWAInstallPrompt />
            <WelcomeModal />
            <div className="md:pl-64 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
              {children}
            </div>
            <Analytics />
            <SpeedInsights />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
