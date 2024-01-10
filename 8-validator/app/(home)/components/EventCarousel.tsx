'use client'
import useLocaleStore from '@/app/hooks/languageStore';
import { ChevronLeftSquareIcon, ChevronRightSquareIcon } from 'lucide-react';
import Link from 'next/link';

import { MessagesProps, getDictionary } from '@/i18n';
import { useEffect, useState } from 'react';
const EventCarousel = () => {
	const {locale} = useLocaleStore();
	const [d, setD] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);

    return (
        <>
            <main className="flex flex-row items-center justify-between bg-yellow-500 px-5 w-[80%] rounded-xl my-10">
                <ChevronLeftSquareIcon />
                <Link href={'/'} scroll={false}>
                    <div className=" py-10 flex flex-col justify-between items-center space-y-2 ">
                        <h1 className="text-3xl font-bold">
                            {d?.texts.data_marathon}
                        </h1>
                        <p>10/02/2024</p>
                    </div>
                </Link>
                <ChevronRightSquareIcon />
            </main>
        </>
    );
};
export default EventCarousel;
