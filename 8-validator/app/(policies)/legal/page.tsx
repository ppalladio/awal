'use client'
import useLocaleStore from "@/app/hooks/languageStore";
import { MessagesProps, getDictionary } from "@/i18n";
import { useEffect, useState } from "react";
const LegalPage = () => {

	const {locale} = useLocaleStore();

	const [dictionary, setDictionary] = useState<MessagesProps>();

	useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setDictionary(m);
        };

        fetchDictionary();
    }, [locale]);

	return (
	<div className="h-[100vh] flex justify-center items-center text-xl">{dictionary?.footer.legal}Aquesta p&#224;gina encara est&#224; en desenvolupament</div>
  )
}
export default LegalPage