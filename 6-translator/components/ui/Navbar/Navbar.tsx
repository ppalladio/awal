'use client';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
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
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    const handleClick = () => {
        setOpen(!open);
    };
    console.log(user);
    return (
        <div
            className="relative flex flex-row  items-center gap-4 p-4 " // Use flex-col and flex-row classes for responsive behavior
            ref={menuRef}
        >
            <motion.button
                variants={{
                    open: { rotate: 90, scale: 1 },
                    closed: { rotate: 0, scale: 1 },
                }}
                animate={open ? 'open' : 'closed'}
            >
                <Button
                    size={'icon'}
                    onClick={handleClick}
                    className="bg-transparent hover:bg-transparent mr-3"
                >
                    {open ? (
                        <Image
                            src={'/logo_line.svg'}
                            height={100}
                            width={100}
                            alt="menu_icon"
                        />
                    ) : (
                        <Image
                            src={'/logo_line.svg'}
                            height={100}
                            width={100}
                            alt="menu_icon"
                        />
                    )}
                </Button>
            </motion.button>
            <div className="lg:w-[10%] w-[8%]">
                <Image
                    src={'/logo_awal.svg'}
                    width={`${110}`}
                    height={30}
                    alt="logo_zgh"
                    className=" bg-yellow-500 w-full px-3 py-2 lg:px-2 lg:py-2"
                />
            </div>
            <Link
                className="transition-colors text-text-accent text-2 lg:text-[2.5rem] "
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
                            <Link href={'/translate'} scroll={false}>
							Traduir
                            </Link>
                        </li>
                        <li>
                            <Link href={'/'} scroll={false}>
							Veu
                            </Link>
                        </li>
                        <li>
                            <Link href={'/about'} scroll={false}>
							Sobre Awal
                            </Link>
                        </li>
                        <li>
                            <Link href={'/resources'} scroll={false}>
							Recursos
                            </Link>
                        </li>
                    </ul>
                </motion.div>
            )}
        </div>
    );
}

export default AppBar;
