import type { NextConfig } from "next";




const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [],
  },
  outputFileTracingExcludes: {
    '*': []
  },
  experimental: {
    // other experimental options if needed
  } as any,
  async headers() {
    return [
      // JSON statiques publics — règle générale EN PREMIER (les règles suivantes l'écrasent)
      {
        source: '/:path*.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=604800' },
        ],
      },
      // Sitemap : cache 24h pour éviter le re-crawl permanent par les bots
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      // Fichiers audio : cache navigateur + CDN Vercel (1 an, immuable)
      {
        source: '/audio/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Fichiers statiques immuables (WBW + pages Coran)
      {
        source: '/quran/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/quran-transliteration.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Pages statiques du Coran, Hisn, Hadith
      {
        source: '/coran/:path*',
        headers: [
          { key: 'CDN-Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        source: '/hisn/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/hadith/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/api/surah-details',
        headers: [
          { key: 'CDN-Cache-Control', value: 'public, max-age=31536000, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from "@ducanh2912/next-pwa";

const audioCdnUrl = (process.env.NEXT_PUBLIC_AUDIO_CDN_URL ?? '').trim().replace(/\/$/, '');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    // Exclude large files from precaching to allow instant install
    exclude: [
      /audio\/.*/,
      /tafsir\/.*/,
      /hadith\/.*/,
      /\.map$/,
      /^manifest.*\.js$/
    ],
    runtimeCaching: [
      // Cache Audio Files (CacheFirst) — local /audio/ ou CDN externe (R2)
      {
        urlPattern: ({ url }: { url: URL }) =>
          (audioCdnUrl ? url.href.startsWith(audioCdnUrl) : false) ||
          /\/audio\/.*\.mp3$/i.test(url.pathname),
        handler: "CacheFirst",
        options: {
          cacheName: "audio-cache",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
          rangeRequests: true,
        },
      },
      // Cache Tafsir & Hadith JSON (StaleWhileRevalidate - can update)
      {
        urlPattern: /\/(tafsir|hadith|quran)\/.*\.json/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "data-cache",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
      // Standard Next.js PWA Caching for anything else
      {
        urlPattern: /\/_next\/image\?url=.+$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "next-image",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
    ],
  },
});

export default withNextIntl(withPWA(nextConfig));
