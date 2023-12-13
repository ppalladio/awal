import Link from 'next/link';
import { Separator } from './separator';
import {
    RiTwitterXFill,
    RiFacebookFill,
    RiInstagramFill,
} from 'react-icons/ri';

const Footer = () => {
    return (
        <div>
            <Separator className="bg-text-primary " />
            <div className="flex flex-row justify-between items-center">
                <div>
                    <ul className="flex flex-col my-5 justify-center items-start ">
                        <li>
                            <Link href={'/translate'}> Tranlstion</Link>
                        </li>
                        <li>
                            <Link href={'/'}>voice</Link>
                        </li>
                        <li>
                            <Link href={'/about'}> about</Link>
                        </li>
                        <li>
                            <Link href={'/resources'}>resources</Link>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-row justify-center items-center space-x-3">
                    <Link href={'https://facebook.com'}>
                        <RiFacebookFill size={30} />
                    </Link>
                    <Link href={'https://twitter.com'}>
                        <RiTwitterXFill size={30} />
                    </Link>

                    <Link href={'https://instagram.com'}>
                        <RiInstagramFill size={30} />
                    </Link>
                </div>
                <div>
                    <ul className="flex flex-col items-end justify-between my-5">
                        <li>
                            <Link href={'/'} className="font-bold">
                                AWAL
                            </Link>
                        </li>
                        <li>
                            <Link href={'/'}> Avís legal</Link>
                        </li>
                        <li>
                            <Link href={'/'}>Política de privacitat</Link>
                        </li>
                        <li>
                            <Link href={'/'}>Política de cookies</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
export default Footer;
