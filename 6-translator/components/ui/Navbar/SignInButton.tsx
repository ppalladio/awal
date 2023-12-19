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
                <Badge className="lg:px-3 lg:py-1 px-2 py-[1px] text-[10px] lg:text-md">{`Contribution Score : ${session.user.score}`}</Badge>
                <Button
                    variant={'outline'}
                    className="text-text-primary lg:font-bold bg-transparent border-transparent "
                >
                    <Link
                        href={'/settings'}
                        scroll={false}
                        className="lg:text-md text-xs"
                    >
                        Settings
                    </Link>
                </Button>
                <Button
                    variant={'outline'}
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-text-accent bg-transparent border-transparent "
                >
                    <span className="lg:font-bold lg:text-md text-xs">
                        Sign Out
                    </span>
                </Button>
            </div>
        );
    }

    // Render the hamburger menu for non-authenticated users on smaller screens
    return (
        <div className="ml-auto lg:hidden">
            {menuOpen ? (
                // When the menu is open, show the close button
                <div className="relative">
                    <Button
                        variant={'outline'}
                        onClick={toggleMenu}
                        className="text-text-accent font-bold bg-transparent"
                    >
                        <X size={20} /> {/* X icon for closing the menu */}
                    </Button>
                    <div className="absolute top-10 right-10 z-10 bg-clay-400 p-10 rounded-md text-text-primary flex flex-row ">
                        {/* Menu items for small screens */}
                        <ul className=" flex  flex-col items-end justify-center font-sm">
                            <li>
                                <Link href={'/'}>AWAL</Link>
                            </li>
                            <li
                                onClick={() => signIn()}
                                className="whitespace-nowrap"
                            >
                                {' '}
                                Inici de sesió
                            </li>
                            <li>
                                {' '}
                                <Link href={'/register'}>Register</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                // When the menu is closed, show the hamburger icon
                <Button
                    variant={'outline'}
                    onClick={toggleMenu}
                    className="text-text-primary font-bold bg-[#FFE7EE]"
                >
                    <div>☰</div>
                </Button>
            )}
        </div>
    );
};

export default SignInButton;
