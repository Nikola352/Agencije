import { Link } from 'react-router-dom';
import { AgencijaHomepage } from '../../data/Agencija';
import { Popover, PopoverContent, PopoverTrigger } from '../floating/Popover';

type AgencijaCardProps = {
    agencija: AgencijaHomepage
}

const AgencijaCard = ({agencija}: AgencijaCardProps) => {
    let destinationFilterOn = false;

    return ( 
        <div className='card'>
            <Link to={`agencija/${agencija.id}`} className="">
                <figure className='relative w-full h-full overflow-hidden'>
                    <img src={agencija.logo} alt="logo" className="relative h-full w-full object-cover" />
                        <h2 
                            dangerouslySetInnerHTML={{ __html: agencija.naziv }}
                            className='absolute left-0 bottom-0 m-4 text-3xl sm:text-4xl font-bold text-white hover:text-primary-500 clickable-shadow'
                        ></h2>
                </figure>
            </Link>            
            <Popover>
                <PopoverTrigger className='absolute top-0 right-0'>
                    <button className='btn-primary text-sm rounded-br-none rounded-tl-none border-none'>
                        <span>Destinacije</span>
                        {destinationFilterOn && (
                            <span className='animate-ping absolute left-0 bottom-0 h-3 w-3 rounded-full bg-sky-400 opacity-75'></span>
                        )}
                        {destinationFilterOn && (
                            <span className="absolute left-0 bottom-0 rounded-full h-3 w-3 bg-sky-500"></span>
                        )}
                        
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    animationOptions={{
                        initial: { rotate: -45, scale: 0},
                        animate: {rotate: 0, scale: 1},
                        transition: {type: "spring", duration: 0.3},
                        exit: { rotate: -45, scale: 0}
                    }}
                >
                    <div className='p-4 pr-12 bg-secondary-600 rounded-lg'>
                        <ul>
                            {agencija.destinacijeList.map(([id, dest], idx) => {
                                return (
                                    <li key={idx} className='m-2'>
                                        <Link to={`destinacija/${agencija.destinacijeID}/${id}`}
                                            className="text-lg hover:text-white text-primary-300 font-semibold"
                                        >
                                            { dest.naziv }        
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
 
export default AgencijaCard;