declare module 'next-pwa' {
    import { NextConfig } from 'next';
    function withPWA(config: {
        dest?: string;
        disable?: boolean;
        register?: boolean;
        scope?: string;
        sw?: string;
        skipWaiting?: boolean;
        runtimeCaching?: unknown[];
        buildExcludes?: string[];
        cacheOnFrontEndNav?: boolean;
        reloadOnOnline?: boolean;
        fallbacks?: { [key: string]: string };
        cacheStartUrl?: boolean;
        dynamicStartUrl?: boolean;
        dynamicStartUrlRedirect?: string;
        publicExcludes?: string[];
    }): (nextConfig: NextConfig) => NextConfig;
    export default withPWA;
}
