'use client';

import useLocaleStore from '@/app/hooks/languageStore';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MessagesProps, getDictionary } from '@/i18n';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StatsProps {
    users: {
        id: string;
        username?: string | null;
        score?: number;
    }[];
}

const Stats: React.FC<StatsProps> = ({ users }) => {
    const { data: session } = useSession();
    const { locale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    console.log(users);

    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);

    return (
        <div className="w-full h-full p-10 flex-col-center bg-slate-200 my-10">
            <h1 className="text-sm mobile:text-2xl mobile:font-semibold capitalize ">
                stats
            </h1>
            <div className="w-full h-full p-10 flex-row-center">
                {/* <div className='w-1/2'>

</div> */}
                <Table className="w-1/2">
                    <TableCaption className="">
                        top 10 contributors
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">
                                {d?.user.username}
                            </TableHead>
                            <TableHead className="text-right">
                                {d?.nav.points}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell
                                    className="font-medium"
                                    key={user.username}
                                >
                                    {user.username}
                                </TableCell>
                                <TableCell
                                    className="text-right"
                                    key={user.score}
                                >
                                    {user.score}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
export default Stats;
