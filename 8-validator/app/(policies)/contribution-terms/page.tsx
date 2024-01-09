'use client';
import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import { useEffect, useState } from 'react';
const ContributionTermsPage = () => {
    const { locale } = useLocaleStore();

    const [dictionary, setDictionary] = useState<MessagesProps>();

    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setDictionary(m);
        };

        fetchDictionary();
    }, [locale]);

    return (
        <div className="h-[100vh] flex justify-center items-center text-xl">
            {dictionary?.footer.contributionTerms}
        </div>
    );
};
export default ContributionTermsPage;
