import Link from 'next/link';
import React from 'react';
import SignInButton from './SignInButton';
import getCurrentUser from '@/app/actions/get/getCurrentUser';
import { AlignJustify } from 'lucide-react';
import Image from 'next/image';
import GoogleTranslate from '@/components/GoogleTranslate';

export async function AppBar() {
    const user = await getCurrentUser();
    console.log(user);
    return (
        <div>
            <header className="flex flex-row items-center gap-4 p-4 ">
                <AlignJustify size={45} />
				<Image src={"/awal_logo.jpg"} width={40} height={40} alt='logo' className='rounded-full' />

                <Link
                    className="transition-colors text-text-accent text-[2.5rem] "
                    href={'/'}
                >
                   AWAL
                </Link>

                <SignInButton />
				<GoogleTranslate/>
            </header>
        </div>
    );
}

export default AppBar;
