export const LanguageRelations: { [key: string]: string[] } = {
    en: ['lad', 'zgh', 'es'],
    zgh: ['en', 'lad', 'es', 'ca', 'fr', 'ary'],
    lad: ['en', 'zgh', 'es', 'ca', 'fr', 'ary'],
    es: ['en', 'zgh', 'lad'],
    ca: ['zgh', 'lad'],
    fr: ['en', 'zgh', 'lad'],
    ary: ['zgh', 'lad'],
};

export const ContributionLanguageRelations: { [key: string]: string[] } = {
    en: ['lad', 'zgh'],
    zgh: ['en', 'es', 'ca', 'fr', 'ary'],
    lad: ['en', 'es', 'ca', 'fr', 'ary'],
    es: ['zgh', 'lad'],
    ca: ['zgh', 'lad'],
    fr: ['zgh', 'lad'],
    ary: ['zgh', 'lad'],
};
export const getLanguageCode = (languageStateValue: string) => {
    switch (languageStateValue) {
        case 'en':
            return 'en';
        case 'ca':
            return 'ca';
        case 'zgh':
            return 'zgh';
        case 'lad':
            return 'lad';
        case 'es':
            return 'es';
        case 'fr':
            return 'fr';
        case 'ary':
            return 'ary';
        default:
            return 'unknown';
    }
};
