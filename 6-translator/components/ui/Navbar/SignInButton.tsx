'use client';
import { signOut, useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { Badge } from '../badge';
import { useUser } from '@/providers/UserInfoProvider';

const SignInButton = () => {
    const { data: session } = useSession();
	const {user} = useUser()
	console.log(user)
    console.log(session?.user);
    if (session && session.user) {
        return (
            <div className="flex gap-4 ml-auto">
                <Link href={'/settings'}>Settings</Link>
                <p className="text-sky-600">{session.user.name}</p>
                <Badge className="px-3 py-1">{`Contribution Score : ${
                    session.user.score || 0
                }`}</Badge>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-red-600"
                >
                    Sign Out
                </button>
            </div>
        );
    }
    return (
        <div className="flex flex-row space-x-3 ml-auto">
            <button onClick={() => signIn()} className="text-green-600 ml-auto">
                Sign In
            </button>
            <Link href={'/register'}>Register</Link>
        </div>
    );
};
export default SignInButton;
