import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionProviders from '@/providers/SessionProviders';
import Navbar from '@/components/ui/Navbar/Navbar';
import { ToastProvider } from '@/providers/ToastProvider';
import ClientProvider from '@/providers/ClientProvider';
import { i18n, Locale } from '@/lib/i18n.config';
import { UserProvider } from '@/providers/UserInfoProvider';
import GoogleTranslate from '@/components/GoogleTranslate';
import Footer from '@/components/ui/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Awal',
    description: 'Generated by create next app',
};

// export async function generateStaticParams() {
// 	return i18n.locales.map((locale)=>({lang:locale}))
// }

export default function RootLayout({
    children,
}: // ,params
{
    children: React.ReactNode;
    // params:{lang:Locale}
}) {
    return (
        <html
        // lang={params.lang}
        >
            <body className={inter.className}>
                <div className="px-6 bg-bg-gradient">

                        <ClientProvider>
                            <SessionProviders>
                                <ToastProvider />
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
