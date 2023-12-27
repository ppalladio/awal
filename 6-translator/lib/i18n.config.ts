export const i18n = {
    defaultLocale: 'ca',
    locales: ['ca', 'zgh'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
