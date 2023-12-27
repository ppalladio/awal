import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import 'server-only';

export const locales = ['ca', 'en', 'zgh', 'fr', 'ary', 'es'];
export type Locale = (typeof locales)[number];

export const defaultLocale = locales[0];
export const isAvailableLocale = (locale: unknown): locale is Locale =>
    typeof locale === 'string' && locales.includes(locale);

export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as any)) notFound();

    return {
        messages: (await import(`@/messages/${locale}.json`)).default,
    };
});

const dictionaries = {
    ca: () => import('@/messages/ca.json').then((module) => module.default),
    en: () => import('@/messages/en.json').then((module) => module.default),
    es: () => import('@/messages/es.json').then((module) => module.default),
    zgh: () => import('@/messages/zgh.json').then((module) => module.default),
    ary: () => import('@/messages/ary.json').then((module) => module.default),
    fr: () => import('@/messages/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
    if (isAvailableLocale(locale)) {
        return dictionaries[locale as keyof typeof dictionaries]();
    } else {
        return dictionaries[defaultLocale as keyof typeof dictionaries]();
    }
};
