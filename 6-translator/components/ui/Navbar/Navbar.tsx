'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import SignInButton from './SignInButton';
import { AlignJustify, X } from 'lucide-react';
import Image from 'next/image';
import GoogleTranslate from '@/components/GoogleTranslate';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
export function AppBar() {
    const { data: session } = useSession();
    const user = session?.user;
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };
    console.log(user);
    return (
        <div>
            <header className="relative flex flex-row items-center gap-4 p-4 ">
                <Button
                    size={'icon'}
                    variant={'ghost'}
                    onClick={handleClick}
                    className="bg-text-accent transition duration-500"
                >
                    {open ? <X size={45} /> : <AlignJustify size={45} />}
                </Button>
                <Image
                    src={'/awal_logo.jpg'}
                    width={40}
                    height={40}
                    alt="logo"
                    className="rounded-full"
                />
                <Link
                    className="transition-colors text-text-accent text-[2.5rem] "
                    href={'/'}
                >
                    AWAL
                </Link>

                <SignInButton />
                <GoogleTranslate />
                {open && (
                    <div
                        className="absolute top-full left-3 bg-text-accent  py-4 px-10 z-10 rounded-xl 
					"
                    >
                        <ul className="space-y-2 mt-2 ">
                            <li>
                                <Link href={'/'}>Translate</Link>
                            </li>
                            <li>
                                <Link href={'/'}>Voice</Link>
                            </li>
                            <li>
                                <Link href={'/'}>About</Link>
                            </li>
                            <li>
                                <Link href={'/'}>Resources</Link>
                            </li>
                        </ul>
                    </div>
                )}
            </header>
        </div>
    );
}

export default AppBar;
