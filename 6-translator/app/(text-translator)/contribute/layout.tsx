'use client';
import ContributeComp from '@/app/components/textTranslator/contributor/ContributeComp';
import TranslatorNav from '@/components/ui/Navbar/TranslatorNav';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function ContributeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    console.log('contribution layout page debug');
    const { data: session } = useSession();
    if (!session?.user) {
        redirect('/');
    }
    const userId = session?.user.id;
    console.log(session?.user);
    return (
        <div>
            <TranslatorNav />
            <ContributeComp userId={userId} />
            {children}
        </div>
    );
}
