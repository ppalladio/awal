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
    console.log(status);
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

    if (session && session.user) {
        return (
            <div className="ml-auto  space-x-1 mobile:space-x-3 flex-row-center ">
                {status === `authenticated` ? (
                    <p className="text-text-primary text-xs mobile:text-mobile">
                        {d?.texts.welcome}{' '}
                        <Link
                            href={'/settings'}
                            className="font-bold hover:underline"
                        >
                            {session.user.username}
                        </Link>
                    </p>
                ) : (
                    <div className="flex-row-center">
                        <Skeleton />
                        <Skeleton />
                    </div>
                )}

                {/* Larger font size on desktop */}
                <Badge className="mobile:px-3 px-2 mobile:py-1 py-[1px] text-[6px] mobile:text-[16px]">
                    {status === `authenticated` ? (
                        <span>
                            {d?.nav.points}
                            {` : ${session.user.score}`}
                        </span>
                    ) : (
                        <Skeleton />
                    )}
                </Badge>
                <Button
                    variant={'outline'}
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-clay-500 bg-transparent border-transparent ml-3 "
                >
                    <span className="mobile:font-bold mobile:text-[14px] font-semibold text-xs ">
                        {status === `authenticated` ? (
                            d?.nav.signOut
                        ) : (
                            <Skeleton />
                        )}
                    </span>
                </Button>
            </div>
        );
    }

    return (
        <div>
            {<div className="hidden mobile:inline-block"></div>}
            <Button
                variant={'outline'}
                onClick={() => signIn()}
                className="text-text-primary bg-transparent border-transparent "
            >
                <span className=" mobile:text-[14px] text-xs">
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
                className="text-text-primary bg-transparent border-slate-500"
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
