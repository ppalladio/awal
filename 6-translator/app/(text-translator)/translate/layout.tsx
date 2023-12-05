import TextTranslator from '@/app/components/translator/TextTranslator';
import TranslatorNav from '@/components/ui/Navbar/TranslatorNav';
import ClientProvider from '@/providers/ClientProvider';

export default async function TranslatePageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    console.log('first');
    return (
        <div>
            <TranslatorNav />
            <TextTranslator />
            {children}
        </div>
    );
}
