/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    i18n: {
        locales: ['ca', 'en-GB', 'fr', 'es-ES', 'zgh', 'ary'],
        defaultLocale: 'ca',
		localeDetection: false,
    },
};

module.exports = nextConfig;
