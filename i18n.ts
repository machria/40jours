import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
    // Provide a static locale, fetch a user setting,
    // read from specified locale or read from `cookies()`, `headers()`, etc.
    // For simplicity, hardcoding 'fr' or reading from cookie if we had middleware.
    // To allow dynamic, we'd typically use `[locale]` layout.
    // Given existing single route structure, strict i18n routing is hard.
    // I will enable it for 'fr' default for now.
    const locale = 'fr';

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
    };
});
