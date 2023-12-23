'use client'

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface StatsProps {
    user: {
		name?: string|null,
		email?: string,
		
		id?: string,
		username?: string,
		gender?:string|null,
		age?: number|null,
		isSubscribed?: boolean|null,
		isPrivacy: boolean|null,
		surname: string|null,
		score?:number|null
	};
}

const Stats= () => {
	const {data:session} = useSession()
	// console.log(session)
	// if(!session?.user)
	// {
	// 	redirect('/');
	// }

    return (
        <div className="w-full h-full p-10 flex flex-col justify-center items-center">
			
		</div>
    );
};
export default Stats;
