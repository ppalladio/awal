export const LanguageRelations: { [key: string]: string[] } = {
    ary: ['zgh', 'lad'],
    ca: ['zgh', 'lad'],
    en: ['lad', 'zgh'],
    es: ['zgh', 'lad'],
    fr: ['zgh', 'lad'],
    lad: ['en', 'es', 'ca', 'fr', 'ary'],
    zgh: ['en', 'es', 'ca', 'fr', 'ary'],
};

export const ContributionLanguageRelations: { [key: string]: string[] } = {
    ary: ['zgh', 'lad'],
    ca: ['zgh', 'lad'],
    en: ['lad', 'zgh'],
    es: ['zgh', 'lad'],
    fr: ['zgh', 'lad'],
    lad: ['en', 'es', 'ca', 'fr', 'ary'],
    zgh: ['en', 'es', 'ca', 'fr', 'ary'],
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
