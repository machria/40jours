import type { NextConfig } from "next";




const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [],
  }
};

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

export default withNextIntl(nextConfig); // PWA removed for now
