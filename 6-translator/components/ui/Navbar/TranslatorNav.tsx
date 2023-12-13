'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const TranslatorNav = () => {
    const { data: session } = useSession();
    const isLoggedIn = !!session?.user;
    const router = useRouter();
    const pathname = usePathname();
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
    const buttonStyle = (path: string) => {
        return pathname === path
            ? 'border-text-primary bg-transparent text-text-primary '
            : 'border-text-primary bg-text-primary text-accent';
    };
    return (
        <div className="flex gap-4 ml-auto my-5">
            <Button variant={'outline'} className={buttonStyle('/translate')}>
                <Link href={'/translate'}>Translate</Link>
            </Button>
            <Button variant={'outline'} className={buttonStyle('/contribute')}>
                <div onClick={handleContribute} className="cursor-pointer ">
                    Contribute
                </div>
            </Button>
            {/* <Button variant={'outline'} className={buttonStyle('/validate')}>
                <div onClick={handleValidate} className="cursor-pointer ">
                    Validate
                </div>
            </Button> */}
        </div>
    );
};

export default TranslatorNav;
