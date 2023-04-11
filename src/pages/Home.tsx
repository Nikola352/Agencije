import AgencijaCard from '../components/AgencijaCard';
import useRenderOnScreenSize from "../hooks/useRenderOnScreenSize";
import { useContext } from 'react';
import { SearchBarContextType } from '../data/SearchBarTypes';
import { AgencijaHomepage } from '../data/Agencija';
import { SearchBarProvider, AgencijaHomepageContext } from '../data/SearchBarContext';
import SearchBar from '../components/SearchBar';

const HomeChild = () => {
    const { filteredData: agencije, error, isPending, filterActive } = useContext(AgencijaHomepageContext) as SearchBarContextType<AgencijaHomepage>;

    const smScreen = useRenderOnScreenSize(640);

    return (
        <div className="Home md:mx-auto">

            <SearchBar
                searchBarType="AgencijaHomepage"
                options={{
                    searchFields: [
                        'naziv',
                        'destinacijeList.1.naziv'
                    ],
                    selectFields: []
                }}
                placeholder="Pretražite agencije ili destinacije..."
            ></SearchBar>

            {smScreen && (
                <h1 className="text-primary-500 text-xl sm:text-2xl fancy-underline m-10 mt-4">
                    Turističke agencije
                </h1>
            )}

            {isPending ? (
                <div className="xl:mx-24 xs:mx-4 grid lg:grid-cols-4 xs:grid-cols-2 grid-cols-1 gap-5 auto-rows-[16rem]">
                    <div className="card bg-primary-300 animate-pulse lg:row-span-2 lg:col-span-2"></div>
                    <div className="card bg-primary-300 animate-pulse"></div>
                    <div className="card bg-primary-300 animate-pulse"></div>
                    <div className="card bg-primary-300 animate-pulse lg:col-span-2"></div>
                    <div className="card bg-primary-300 animate-pulse lg:col-span-2"></div>
                    <div className="card bg-primary-300 animate-pulse lg:col-span-2"></div>
                </div>
            ) : error ? (
                <p>{error}</p>
            ) : (agencije && agencije.length>0) ? (
                <div className="agencije-list xl:mx-24 xs:mx-4 grid lg:grid-cols-4 xs:grid-cols-2 grid-cols-1 gap-5 auto-rows-[16rem]">
                    {agencije.map((agencija, idx) => (
                        <div key={idx} className={`${(idx != 1 && idx != 2) ? 'lg:col-span-2' : ''} ${idx == 0 ? 'lg:row-span-2' : ''}`}>
                            <AgencijaCard agencija={agencija}></AgencijaCard>
                        </div>
                    ))}
                </div>
            ) : (
                <p className='text-secondary-600 text-lg text-center'>Trenutno nema dostupnih agencija{filterActive ? ' koje odgovaraju pretrazi': ''}.</p>
            )}
        </div>
    );
}

const Home = () => {
    return (
        <SearchBarProvider<AgencijaHomepage> searchBarType="AgencijaHomepage">
            <HomeChild />
        </SearchBarProvider>
    )
}


export default Home;
