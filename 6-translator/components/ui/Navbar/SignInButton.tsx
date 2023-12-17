'use client';
import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';
import { Badge } from '../badge';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const SignInButton = () => {
    const { data: session } = useSession();
    console.log('sign in button check', session);
    if (session && session.user) {
        return (
            <div className="flex flex-row items-center justify-between gap-4 ml-auto">
                <p className="text-text-primary">{session.user.name}</p>
                <Badge className="px-3 py-1">{`Contribution Score : ${session.user.score}`}</Badge>
                <Button
                    variant={'outline'}
                    className="text-text-primary font-bold bg-transparent"
                >
                    <Link href={'/settings'}>Settings</Link>
                </Button>
                <Button
                    variant={'outline'}
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-text-accent font-bold bg-transparent"
                >
                    Sign Out
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-row space-x-3 ml-auto">
            <Button
                variant={'outline'}
                onClick={() => signIn()}
                className="text-text-primary font-bold bg-[#FFE7EE] ml-auto"
            >
                Inici de sesió
            </Button>
            <Button
                variant={'outline'}
                className="text-text-primary font-bold bg-[#FFE7EE]"
            >
                <Link href={'/register'}>Register</Link>
            </Button>
        </div>
    );
};

export default SignInButton;
