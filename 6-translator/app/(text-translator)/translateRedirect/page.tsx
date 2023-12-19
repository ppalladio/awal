'use client';

import TextTranslator from '@/app/components/textTranslator/translator/TextTranslator';
import { Button } from '@/components/ui/button';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
const ValidatePage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const isAuthenticated = !!session?.user;
    if (session && session?.user) {
        router.push('/translate',{scroll:false});
        router.refresh();
    }
    const signInHandle = () => {
        signIn();
    };
    const registerHandle = () => {
        router.push('/register',{scroll:false});
    };
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-primary">
                <div>
                    Please
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <Button
                                onClick={signInHandle}
                                className="uppercase"
                                variant="link"
                            >
                               Inici de sesi&oacute;
                            </Button>
                        </HoverCardTrigger>
                    </HoverCard>{' '}
                    or
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <Button
                                onClick={registerHandle}
                                className="uppercase"
                                variant="link"
                            >
                                sign up
                            </Button>
                        </HoverCardTrigger>
                    </HoverCard>
                    to use the Contribute
                </div>
            </div>
        );
    }
    return (
        <div className="">
            <TextTranslator />;
        </div>
    );
};

export default ValidatePage;
