'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import SignInButton from './SignInButton';
import { AlignJustify, X } from 'lucide-react';
import Image from 'next/image';
import GoogleTranslate from '@/components/GoogleTranslate';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function AppBar() {
    const { data: session } = useSession();
    const user = session?.user;
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };
    console.log(user);
    return (
        <div className="relative flex flex-row items-center gap-4 p-4 ">
            <motion.button
                variants={{
                    open: { rotate: 45, scale: 1.2 },
                    closed: { rotate: 0, scale: 1 },
                }}
                animate={open ? 'open' : 'closed'}
            >
                <Button
                    size={'icon'}
                    onClick={handleClick}
                    className="hover:text-text-accent bg-transparent hover:bg-transparent "
                >
                    {open ? <X size={45} /> : <AlignJustify size={45} />}
                </Button>
            </motion.button>
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
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={{
                        hidden: {
                            opacity: 0,
                            scale: 0.95,
                            transition: {
                                duration: 0.2,
                            },
                        },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            transition: {
                                duration: 0.2,
                            },
                        },
                    }}
                    className="absolute top-full left-3 bg-text-accent py-4 px-10 z-10 rounded-xl"
                >
                    <ul className="space-y-2 mt-2">
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
                </motion.div>
            )}
        </div>
    );
}

export default AppBar;
