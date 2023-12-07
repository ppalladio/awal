export const LanguageRelations: { [key: string]: string[] } = {
	en: ['ber', 'zgh', 'es'],
	zgh: ['en', 'ber', 'es', 'ca', 'fr', 'ary'],
	ber: ['en', 'zgh', 'es', 'ca', 'fr', 'ary'],
	es: ['en', 'zgh', 'ber'],
	ca: ['zgh', 'ber'],
	fr: ['en', 'zgh', 'ber'],
	ary: ['zgh', 'ber'],
};
export const getLanguageCode = (languageStateValue: string) => {
	switch (languageStateValue) {
		case 'en':
			return 'en';
		case 'ca':
			return 'ca';
		case 'zgh':
			return 'zgh';
		case 'ber':
			return 'ber';
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