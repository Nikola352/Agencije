import { useState, useEffect } from 'react';
import Slideshow from '../components/sliders/Slideshow';
import useDBFetch from '../hooks/useDBFetch';
import { useParams } from 'react-router-dom';
import { Destinacija } from '../data/Destinacija';
import useRenderOnScreenSize from '../hooks/useRenderOnScreenSize';

const DestinacijaPage = () => {
    const {id1, id2} = useParams<{id1: string, id2: string}>();
    const {data: destinacija, error, isPending} = useDBFetch<Destinacija>(`destinacije/${id1}/${id2}`);

    const [slideshowWidth, setSlideshowWidth] = useState(0.45 * window.innerWidth);
    const [slideshowHeight, setSlideshowHeight] = useState<string|number>(0.8*window.innerHeight);

    const lgScreen = useRenderOnScreenSize(1024)

    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth > 1024) {
                setSlideshowWidth(0.45 * window.innerWidth);
                setSlideshowHeight(0.8 * window.innerHeight)
            } else {
                setSlideshowWidth(0.9 * window.innerWidth);
                setSlideshowHeight('24rem')
            }
        }

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return ( 
        <div id="destinacija" className='flex items-center lg:items-start flex-col lg:flex-row'>
            {!lgScreen && (
                <h1 className='text-3xl fancy-underline mb-4 font-semibold'>
                    {destinacija ? destinacija.naziv : "Destinacija"}
                </h1>
            )}

            {error && <div>Došlo je do greške pri učitavanju podataka.</div>}

            {isPending && <div className='card animate-pulse bg-secondary-400' style={{width: slideshowWidth, height: slideshowHeight}}></div>}

            {destinacija && (
                <aside className='flex-grow'>
                    <Slideshow slides={destinacija.slike} width={slideshowWidth} height={slideshowHeight} autoPlayInterval={4} duration={0.6}/>
                </aside>
            )}

            <article className='h-full flex flex-col justify-start items-center flex-grow'>
                {lgScreen && (
                    <h1 className='text-4xl fancy-underline mb-4 font-semibold'>
                    {destinacija ? destinacija.naziv : "Destinacija"}
                    </h1>
                )}
                <section>
                    {isPending && (
                        <div className='card animate-pulse bg-secondary-400' style={{width: '20rem', height: '20rem'}}></div>
                    )}
                    {destinacija && (
                        <div className='text-xl m-4 sm:mx-8 text-justify after:clear-right'>
                            <section id="card" className='card inline-block xs:float-right bg-white w-full sm:w-1/3 mb-2 sm:m-4 p-2'>
                                <p className='text-2xl text-center'>
                                    <strong className='text-3xl text-primary-500'>{destinacija.cena}</strong>
                                    <span>rsd</span>
                                </p>
                                <p className='text-lg text-center bg-primary-500 text-white rounded-lg m-4'>{destinacija.tip}</p>
                                <p className='text-lg text-center bg-primary-500 text-white rounded-lg m-4'>{destinacija.prevoz}</p>
                            </section>
                            <span>
                                {destinacija.opis}
                            </span>
                        </div>
                    )}
                </section>
            </article>

        </div>
    );
}
 
export default DestinacijaPage;