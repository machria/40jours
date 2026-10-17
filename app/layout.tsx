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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
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
