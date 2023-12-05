'use client';
import { Languages, Mic2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Translation = () => {
    const router = useRouter();

    const handleTextTranslation = () => {
        router.push('/translate');
    };
    return (
        <div className="w-full ">
            {/* translators */}

            <div className="flex flex-row justify-center items-center w-full h-[50vh]">
                <div 
                    onClick={handleTextTranslation}
                    className=" cursor-pointer	flex flex-row justify-center items-center bg-slate-100 w-full h-full hover:bg-green-100 transition duration-500"
                >
                    <Languages className="h-10 w-10" />
                </div>
                <div className="flex flex-row justify-center items-center bg-slate-500 w-full h-full hover:bg-green-100 transition duration-500">
                    <Mic2 className="h-10 w-10" />
                </div>
            </div>
        </div>
    );
};
export default Translation;
