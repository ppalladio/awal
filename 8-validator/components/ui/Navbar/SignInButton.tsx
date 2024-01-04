'use client';
import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';
import { Badge } from '../badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Skeleton } from '../skeleton';
import { usePathname } from 'next/navigation';
import { MessagesProps, getDictionary } from '@/i18n';
import useLocaleStore from '@/app/hooks/languageStore';

const SignInButton = () => {
    const { data: session, status } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    console.log('sign in button check', session);
    const pathname = usePathname();
    const { locale } = useLocaleStore();

    const [d, setD] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);
    if (status === 'loading') {
        return (
            <div className="flex flex-row items-center justify-center space-x-4">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        );
    }
    if (session && session.user) {
        return (
            <div className="ml-auto flex flex-row space-x-1 lg:space-x-3 items-center justify-center ">
                <p className="text-text-primary text-sm lg:text-lg">
                    {d?.texts.welcome}
                    <Link href={'/settings'} className="font-bold hover:underline">
                        {session.user.username}
                    </Link>
                </p>{' '}
                {/* Larger font size on desktop */}
                <Badge className="lg:px-3 px-2 lg:py-1 py-[1px] text-[12px] lg:text-[16px]">
                    {d?.nav.points}
                    {` : ${session.user.score}`}
                </Badge>
                <Button
                    variant={'outline'}
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-clay-500 bg-transparent border-transparent ml-3 "
                >
                    <span className="lg:font-bold lg:text-[14px] font-semibold text-xs ">
                        {d?.nav.signOut}
                    </span>
                </Button>
            </div>
        );
    }

    return (
        <div>
            <Button
                variant={'outline'}
                onClick={() => signIn()}
                className="text-text-primary bg-transparent border-transparent "
            >
                <span className=" lg:text-[14px] text-xs">
                    {pathname === '/signIn' ? (
                        <span className="font-bold capitalize">
                            {d?.nav.signIn}
                        </span>
                    ) : (
                        <span className="capitalize">{d?.nav.signIn}</span>
                    )}
                </span>
            </Button>
            <Button
                variant={'outline'}
                className="text-text-primary bg-transparent border-transparent "
            >
                <Link href={'/register'}>
                    {pathname === '/register' ? (
                        <span className="font-bold">{d?.nav.signUp}</span>
                    ) : (
                        <span>{d?.nav.signUp}</span>
                    )}
                </Link>
            </Button>
        </div>
    );
};

export default SignInButton;
