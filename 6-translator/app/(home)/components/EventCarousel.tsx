import Image from 'next/image';
const images = ['/p1.jpg', '/p2.jpg', '/p3.jpg'];
const EventCarousel = () => {
    return (
        <main className="flex flex-col-ew items-center justify-between min-h-screen p-24">
            <div className="relative w-full max-w-[1500px] flex items-center">
                <div className="flex flex-col gap-4 flex-nowrap">
                    {[...images].map((image, index) => (
                        <Image
                            key={index}
                            src={image}
                            alt={image}
                            className="object-cover aspect-[16/9]"
                            width={1600}
                            height={1200}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
};
export default EventCarousel;
