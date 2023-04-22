import { Link } from "react-router-dom";
import { DestinacijaSB } from "../data/Destinacija";

type DestinacijaProps = {
    dest: DestinacijaSB;
    gid: string;
}

const DestinacijaCard = ({dest, gid}: DestinacijaProps) => {
    return ( 
        <div className="card bg-white group">
            <Link to={`/destinacija/${gid}/${dest.id}`} className="h-full w-full">
                <figure className='relative w-full h-3/4 overflow-hidden'>
                    <img src={dest.thumbnail} alt={dest.naziv} className="relative w-full h-full object-cover" />
                        <h2 className='absolute left-0 bottom-0 m-4 text-3xl sm:text-4xl font-bold text-white group-hover:text-primary-500 shadow-black [text-shadow:_0_1px_0_var(--tw-shadow-color)] group-hover:[text-shadow:_0_2px_0_var(--tw-shadow-color)]'>
                            {dest.naziv}
                        </h2>
                </figure>     
                <section className="grid grid-rows-2 grid-cols-2 h-1/4 p-2 gap-2">
                    <p className="row-span-2 text-secondary-600 text-xl text-center align-middle break-normal">
                        <span className="text-3xl text-primary-500 font-bold">{dest.cena}</span>
                        <span>rsd</span> 
                    </p>
                    <p className="text-center text-md text-white bg-primary-500 rounded-lg">
                        {dest.tip}
                    </p>
                    <p className="text-center text-md text-white bg-primary-500 rounded-lg">
                        {dest.prevoz}
                    </p>
                </section>
            </Link>
        </div>
    );
}
 
export default DestinacijaCard;