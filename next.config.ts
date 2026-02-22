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
      // Fichiers audio : cache navigateur + CDN Vercel (1 an, immuable)
      {
        source: '/audio/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // JSON statiques publics (Coran, translittération, surahs…)
      {
        source: '/:path*.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=604800' },
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
          { key: 'CDN-Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        source: '/hadith/:path*',
        headers: [
          { key: 'CDN-Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
      // API statiques (Coran, WBW, Surah details)
      {
        source: '/api/quran/:path*',
        headers: [
          { key: 'CDN-Cache-Control', value: 'public, max-age=31536000, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/api/wbw',
        headers: [
          { key: 'CDN-Cache-Control', value: 'public, max-age=31536000, stale-while-revalidate=86400' },
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
      // Cache Audio Files (CacheFirst) — local /audio/ ou CDN externe
      {
        urlPattern: /\/audio\/.*\.mp3$/i,
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
