import { Link } from 'react-router-dom';
import { Agencija } from '../data/Agencija';

type AgencijaCardProps = {
    agencija: Agencija
    id: string
}

const AgencijaCard = ({agencija, id}: AgencijaCardProps) => {
    return ( 
        <div className='card'>
            <figure className='relative w-full h-full overflow-hidden'>
                <img src={agencija.logo} alt="logo" className="relative h-full w-full object-cover" />
                <Link to={`agencija/${id}`} className="absolute left-0 bottom-0 m-4">
                    <h2 className='text-2xl sm:text-3xl font-bold text-white hover:text-primary-500 clickable-shadow'>
                        {agencija.naziv}
                    </h2>
                </Link>
            </figure>
        </div>
    );
}
 
export default AgencijaCard;