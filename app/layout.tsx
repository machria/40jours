import type { Metadata } from "next";
import { Inter, Reem_Kufi } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import Navigation from "@/components/layout/Navigation";
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
        className={`${inter.variable} ${kufi.variable} antialiased font-sans bg-background text-foreground`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navigation />
            <div className="md:pl-64 pb-16 md:pb-0">
              {children}
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
