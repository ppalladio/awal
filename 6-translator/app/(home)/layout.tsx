import { useSession } from 'next-auth/react';
import EventCarousel from './components/EventCarousel';
import ProjectIntro from './components/ProjectIntro';
import Stats from './components/Stats';
import Translation from './components/Translation';
import SessionProviders from '@/providers/SessionProviders';
import ClientProvider from '@/providers/ClientProvider';

export default async function HomepageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {/* <SessionProviders> */}
			<ClientProvider>

                <Translation />
                <ProjectIntro />
                {/* //TODO phase 2 */}
                {/* <EventCarousel/> */}

                <Stats />
                {children}
			</ClientProvider>
            {/* </SessionProviders> */}
        </div>
    );
}
