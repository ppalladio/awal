import Link from 'next/link';
import { Separator } from './separator';
import {
    RiTwitterXFill,
    RiFacebookFill,
    RiInstagramFill,
    RiGithubFill,
} from 'react-icons/ri';

const Footer = () => {
    return (
        <div>
            <Separator className="bg-text-primary " />
            <div className="flex flex-row justify-between items-center">
                <div>
                    <ul className="flex flex-col my-5 justify-center items-start ">
                        <li>
                            <Link href={'/translate'}> Translation</Link>
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
                    <Link target="_blank" href={'https://facebook.com'}>
                        <RiFacebookFill size={30} />
                    </Link>
                    <Link
                        target="_blank"
                        href={'https://twitter.com/Awaldigital'}
                    >
                        <RiTwitterXFill size={30} />
                    </Link>

                    <Link
                        target="_blank"
                        href={'https://www.instagram.com/awaldigital/'}
                    >
                        <RiInstagramFill size={30} />
                    </Link>
                    <Link
                        target="_blank"
                        href={'https://github.com/CollectivaT-dev/awal-web'}
                    >
                        <RiGithubFill size={30} />
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
                            <Link href={'/legal'}> Avís legal</Link>
                        </li>
                        <li>
                            <Link href={'/privacy'}>
                                Política de privacitat
                            </Link>
                        </li>
                        <li>
                            <Link href={'/cookies'}>Política de cookies</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
export default Footer;
