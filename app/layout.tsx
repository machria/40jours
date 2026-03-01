import type { Metadata } from "next";
import { Inter, Reem_Kufi, Amiri } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import Navigation from "@/components/layout/Navigation";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const kufi = Reem_Kufi({
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kufi",
});

// Police dédiée au texte coranique Hafs — supporte tous les caractères
// Unicode étendus (U+06D0–U+06FF) : marques ghunna ۭ, petit waw ۥ, etc.
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-quran",
});

export const metadata: Metadata = {
  title: "Coran 40 Jours - Défi Lecture & Tafsir",
  description: "Complétez la lecture du Coran en 40 jours avec Tafsir Ibn Kathir et 99 Noms d'Allah.",
  manifest: "/manifest.json",
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
        className={`${inter.variable} ${kufi.variable} ${amiri.variable} antialiased font-sans bg-background text-foreground`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navigation />
            <PWAInstallPrompt />
            <div className="md:pl-64 pb-16 md:pb-0">
              {children}
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
