import ValidateComp from '@/app/components/textTranslator/validator/ValidateComp';
import TranslatorNav from '@/components/ui/Navbar/TranslatorNav';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default async function ValidateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
	
	console.log("first")
    return (
        <div>
			<TranslatorNav/>
            {/* <ValidateComp /> */}
            {children}
        </div>
    );
}
