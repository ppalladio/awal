'use client';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import SignInButton from './SignInButton';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Skeleton } from '../skeleton';
import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../dropdown-menu';

const AppBar = () => {
    const { data: session, status } = useSession();
    const user = session?.user;
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    // get locale and set new local
    const { locale, setLocale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);

    const changeLocale = (newLocale: string) => {
        setLocale(newLocale);
    };
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
    if (status === 'loading') {
        return (
            <div className="flex flex-row justify-center items-center space-x-4">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        );
    }
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
            <div className="w-[7%] ">
                <Link href={'/'} scroll={false}>
                    <Image
                        src={'/logo_awal.svg'}
                        width={`${110}`}
                        height={30}
                        alt="logo_zgh"
                        className=" bg-yellow-500 w-full px-[6px] py-[4px] lg:px-[8px] lg:py-[6px]"
                    />
                </Link>
            </div>
            <Link
                className="transition-colors text-text-accent text-2 lg:text-[2.5rem] "
                href={'/'}
                scroll={false}
            >
                AWAL
            </Link>

            <div className="flex-grow"></div>
            <SignInButton />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        {locale === 'es' && d?.language?.es}
                        {locale === 'ca' && d?.language?.ca}
                        {locale === 'en' && d?.language?.en}
                        {/* {locale === 'ary' && d?.language?.ary} */}
                        {locale === 'fr' && d?.language?.fr}
                        {locale === 'zgh' && d?.language?.zgh}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>
                        {d?.translator.select_lang}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                        value={locale}
                        onValueChange={changeLocale}
                    >
                        <DropdownMenuRadioItem value="ca">
                            {d?.language?.ca}
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="es">
                            {d?.language?.es}
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="en">
                            {d?.language?.en}
                        </DropdownMenuRadioItem>

                        <DropdownMenuRadioItem value="fr">
                            {d?.language?.fr}
                        </DropdownMenuRadioItem>
                        {/* <DropdownMenuRadioItem value="ary">
                            {d?.language?.ary}
                        </DropdownMenuRadioItem> */}
                        <DropdownMenuRadioItem value="zgh">
                            {d?.language?.zgh}
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>

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
                                {d?.menu.translator}
                            </Link>
                        </li>
                        <li>
                            <Link href={'/'} scroll={false}>
                                {d?.menu.voice}
                            </Link>
                        </li>
                        <li>
                            <Link href={'/about'} scroll={false}>
                                {d?.menu.about}
                            </Link>
                        </li>
                        <li>
                            <Link href={'/resources'} scroll={false}>
                                {d?.menu.resources}
                            </Link>
                        </li>
                    </ul>
                </motion.div>
            )}
        </div>
    );
};

export default AppBar;
