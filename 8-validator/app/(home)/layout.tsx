'use client';
import Footer from '@/components/ui/Footer';
import ProjectIntro from './components/ProjectIntro';
import Stats from './components/Stats';
import Translation from './components/Translation';
import ClientProvider from '@/providers/ClientProvider';
import EventCarousel from './components/EventCarousel';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomepageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [totalEntries, setTotalEntries] = useState(0);
    const [topTen, setTopTen] = useState([]);
    const apiUrl =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://awaldigital.org';

    // get total entries
    useEffect(() => {
        const fetchData = async () => {
            try {
				//attempt solution for 304 production error/ cache control header
                const req = await axios.get(`${apiUrl}/api/entries`, {
                    headers: { 'Cache-Control': 'no-cache' },
                });
                console.log(req.data.topTen);
                setTotalEntries(req.data.totalEntries);
                setTopTen(req.data.topTen);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };
        fetchData();
    }, [apiUrl]);
    console.log(topTen);
    return (
        <div className="flex flex-col items-center justify-center ">
            <ClientProvider>
                <Translation totalEntries={totalEntries} />
                <ProjectIntro />
                <EventCarousel />
                {/* <Stats users={topTen} /> */}
                {children}
            </ClientProvider>
        </div>
    );
}
