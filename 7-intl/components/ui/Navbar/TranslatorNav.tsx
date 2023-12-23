'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '../separator';

const TranslatorNav = () => {
    const { data: session } = useSession();
    const isLoggedIn = !!session?.user;
    const router = useRouter();
    const pathname = usePathname();
    const handleContribute = () => {
        if (isLoggedIn) {
            router.push('/contribute',{scroll:false});
        } else {
            router.push('/translateRedirect',{scroll:false});
        }
    };
    const handleValidate = () => {
        if (isLoggedIn) {
            router.push('/validate',{scroll:false});
        } else {
            router.push('/translateRedirect',{scroll:false});
        }
    };
    const buttonStyle = (path: string) => {
        return pathname === path
            ? 'border-text-primary bg-text-primary text-accent'
            : 'border-text-primary bg-transparent text-text-primary ';
    };
    return (
        <>
            <Separator className="bg-text-primary mx-auto my-5 " />
            <div className="flex gap-4 ml-10 my-5">
                <Button
                    variant={'outline'}
                    className={buttonStyle('/translate')}
                >
                    <Link href={'/translate'} scroll={false}>Traductor</Link>
                </Button>
                <Button
                    variant={'outline'}
                    className={buttonStyle('/contribute')}
                >
                    <div onClick={handleContribute} className="cursor-pointer ">
					Contribuir
                    </div>
                </Button>
                {/* <Button variant={'outline'} className={buttonStyle('/validate')}>
                <div onClick={handleValidate} className="cursor-pointer ">
				Validate
                </div>
            </Button> */}
            </div>
        </>
    );
};

export default TranslatorNav;
