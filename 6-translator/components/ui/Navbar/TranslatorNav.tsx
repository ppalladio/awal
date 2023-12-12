'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const TranslatorNav = () => {
    const { data: session } = useSession();
    const isLoggedIn = !!session?.user;
    const router = useRouter();
    const handleContribute = () => {
        if (isLoggedIn) {
            router.push('/contribute');
        } else {
            router.push('/translateRedirect');
        }
    };
    const handleValidate = () => {
        if (isLoggedIn) {
            router.push('/validate');
        } else {
            router.push('/translateRedirect');
        }
    };
    return (
        <div className="flex gap-4 ml-auto">
            <Link href={'/translate'}>Translate</Link>
            <div onClick={handleContribute} className="cursor-pointer">
                Contribute
            </div>
            <div onClick={handleValidate} className="cursor-pointer">
                Validate
            </div>
        </div>
    );
};

export default TranslatorNav;
