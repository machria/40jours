import type { NextConfig } from "next";




const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [],
  },
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        './public/audio/**/*',
        './public/tafsir/**/*',
        './public/hadith/**/*'
      ]
    }
  } as any
};

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

export default withNextIntl(nextConfig); // PWA removed for now
