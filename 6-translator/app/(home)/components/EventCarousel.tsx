import { ChevronLeftSquareIcon, ChevronRightSquareIcon } from 'lucide-react';
import Link from 'next/link';

const EventCarousel = () => {
    return (
        <main className="flex flex-row items-center justify-between bg-text-primary text-gray-100 px-5 w-1/2 rounded-xl">
            <ChevronLeftSquareIcon />
            <Link href={'/'}>
                <div className=" p-10  flex flex-col justify-between items-center space-y-2 ">
                    <h1 className="text-3xl font-bold">
                        Datathon dia mundial amazic
                    </h1>
                    <p>15/01/2024</p>
                </div>
            </Link>
            <ChevronRightSquareIcon />
        </main>
    );
};
export default EventCarousel;
