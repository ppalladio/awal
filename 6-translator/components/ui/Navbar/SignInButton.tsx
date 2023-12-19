'use client';
import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';
import { Badge } from '../badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { X } from 'lucide-react';
const SignInButton = () => {
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    console.log('sign in button check', session);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    if (session && session.user) {
        return (
            <div className="ml-auto flex flex-row space-x-1 lg:space-x-3 items-center justify-center ">
                <p className="text-text-primary text-sm lg:text-lg">
                    {session.user.name}
                </p>{' '}
                {/* Larger font size on desktop */}
                <Badge className="lg:px-3 lg:py-1 px-2 py-[1px] text-[10px] lg:text-[14px]">
                    Punt de contribuci&#243;{` : ${session.user.score}`}
                </Badge>
                <Button
                    variant={'outline'}
                    className="text-text-primary lg:font-bold bg-transparent border-transparent "
                >
                    <Link
                        href={'/settings'}
                        scroll={false}
                        className="lg:text-[14px] text-xs"
                    >
                        Configuraci&#243;
                    </Link>
                </Button>
                <Button
                    variant={'outline'}
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-text-accent bg-transparent border-transparent "
                >
                    <span className="lg:font-bold lg:text-[14px] text-xs">
                        Tanca la sessió
                    </span>
                </Button>
            </div>
        );
    }

    // Render the hamburger menu for non-authenticated users on smaller screens
    return (
        <div>
            <Button
                variant={'outline'}
                onClick={() => signIn()}
                className="text-text-primary bg-transparent border-transparent "
            >
                <span className="lg:font-bold lg:text-[14px] text-xs">
                    Iniciar sessió
                </span>
            </Button>
            <Button
                variant={'outline'}
                className="text-text-primary bg-transparent border-transparent "
            >
                <Link href={'/register'}> Registre</Link>
            </Button>
        </div>
    );
};

export default SignInButton;
