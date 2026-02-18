import type { NextConfig } from "next";




const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [],
  },
  outputFileTracingExcludes: {
    '*': [
      './public/audio/**/*',
      './public/tafsir/**/*',
      './public/hadith/**/*'
    ]
  },
  experimental: {
    // other experimental options if needed
  } as any,
  async headers() {
    return [
      {
        source: '/audio/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
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
      // Cache Audio Files (CacheFirst - they don't change)
      {
        urlPattern: /\/audio\/.*\.mp3/i,
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
