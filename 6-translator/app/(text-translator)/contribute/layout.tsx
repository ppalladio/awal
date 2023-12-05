import TextTranslator from '@/app/components/translator/TextTranslator';
import TranslatorNav from '@/components/ui/Navbar/TranslatorNav';

export default async function ContributeLayout({
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
