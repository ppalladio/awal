'use client';
import useLocaleStore from '@/app/hooks/languageStore';
import Heading from '@/components/ui/Heading';
import { Button } from '@/components/ui/button';
import { Heading2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { MessagesProps, getDictionary } from '@/i18n';
import { useEffect, useState } from 'react';
const ProjectIntro = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const { locale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);

    return (
        <div className=" py-10 whitespace text-text-primary">
            <div className=" w-full h-full flex flex-col items-center ">
                <h1 className="text-3xl font-semibold ">
                    {d?.page_intro?.title}
                </h1>
                <div className="flex flex-row justify-center items-center ">
                    <div className="flex flex-col w-1/2  mt-5 mx-10 text-gray-700">
                        <p>{d?.page_intro?.CTA_text}</p>
                        <p className="pt-2">
                            <Heading
                                title={`${d?.page_intro.heading_1}`}
                                titleClassName="text-xl mb-2"
                            />

                            <ul className="list-disc space-y-3">
                                <li className="ml-4">
                                    <strong>
                                        {d?.page_intro.item_1_strong}
                                    </strong>
                                    {d?.page_intro.item_1_normal}
                                </li>
                                <li className="ml-4">
                                    <strong>
                                        {d?.page_intro.item_2_strong}
                                    </strong>
                                    {d?.page_intro.item_2_normal}
                                </li>
                                <li className="ml-4">
                                    <strong>
                                        {d?.page_intro.item_3_strong}
                                    </strong>{' '}
                                    {d?.page_intro.item_3_normal}
                                </li>
                            </ul>
                        </p>
                    </div>
                    <div className="w-1/2  flex flex-col  justify-end mt-5 text-gray-700 ">
                        <Heading
                            title={`${d?.page_intro.heading_2}`}
                            titleClassName="text-xl pt-5"
                        />

                        <p className="">{d?.page_intro.text_2}</p>
                        <Heading
                            title={`${d?.page_intro.heading_3}`}
                            titleClassName="text-xl pt-5"
                        />
                        <p>{d?.page_intro.text_3}</p>
                    </div>
                </div>
                {session ? (
                    ''
                ) : (
                    <Button
                        variant="default"
                        size="lg"
                        className="mt-5 bg-text-primary "
                        // TODO: the redirect endpoint needs to be changed
                        onClick={() =>
                            router.push('/signIn', { scroll: false })
                        }
                    >
                        {d?.page_intro.CTA_button}
                    </Button>
                )}
            </div>
        </div>
    );
};
export default ProjectIntro;
