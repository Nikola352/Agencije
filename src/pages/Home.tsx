import { Agencija } from "../data/Agencija"
import AgencijaCard from '../components/AgencijaCard';
import useDBFetch from "../hooks/useDBFetch";
import useRenderOnScreenSize from "../hooks/useRenderOnScreenSize";

const Home = () => {
    const {data: agencije, error, isPending} = useDBFetch<{[key:string]: Agencija;}>("agencije");

    const smScreen = useRenderOnScreenSize(640);

    return ( 
        <div className="Home md:mx-auto">
            {smScreen && (
                <h1 className="text-primary-500 text-xl sm:text-2xl fancy-underline m-10">
                    Turističke agencije
                </h1>
            )}

            {isPending ? (
                <p>Pending...</p>
            ): error ? (
                <p>{error}</p>
            ): (agencije) ? (
                <div className="agencije-list xl:mx-24 xs:mx-4 grid lg:grid-cols-4 xs:grid-cols-2 grid-cols-1 gap-4 auto-rows-[16rem]">
                    {Object.keys(agencije).map((id, idx) => (
                        <div key={idx} className={`${(idx!=1 && idx!=2) ? 'lg:col-span-2' : ''} ${idx==0 ? 'lg:row-span-2' : ''}`}>
                            <AgencijaCard agencija={agencije[id]} id={id}></AgencijaCard>
                        </div>
                    ))}
                </div>                
            ): (
                <p>Trenutno nema dostupnih agencija.</p>
            )}

        </div>
     );
}
 
export default Home;