
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionProviders from '@/providers/SessionProviders';
import Navbar from '@/components/ui/Navbar/Navbar';
import { ToastProvider } from '@/providers/ToastProvider';
import ClientProvider from '@/providers/ClientProvider';
import Footer from '@/components/ui/Footer';

import {headers} from 'next/headers'
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Awal',
    description: 'Generated by create next app',
};


export default function RootLayout({
    children
}: 
{
    children: React.ReactNode;

}) {
	const Locale = headers().get('Accept-Language')?.slice(0,2) ?? 'ca'

    return (
        <html
        lang={Locale}
        >
            <body className={inter.className}>
		
                <div className=" bg-bg-gradient">

                        <ClientProvider>
                            <SessionProviders>
								{}
                                <ToastProvider />
								{/* <RegisterModal/> */}
                                <Navbar 
                                // lang={params.lang}
                                />
                                {/* <GoogleTranslate/> */}
                                {children}
                                <Footer />
                            </SessionProviders>
                        </ClientProvider>
                    
                </div>
            </body>
        </html>
    );
}
