import { Link } from "react-router-dom";
import desert_island from "../assets/images/desert-island.svg"
import useRenderOnScreenSize from "../hooks/useRenderOnScreenSize";

const NotFound = () => {
    const lgScreen = useRenderOnScreenSize(1024);

    return ( 
        <div id="not-found" className="relative">
            {!lgScreen && <h1 className="text-9xl font-bold text-primary-500 text-center">404</h1>}
            {!lgScreen && ( 
                <h3 className="text-4xl text-secondary-600 text-center m-4">
                    Došlo je do greške!
                </h3>
            )}
            {!lgScreen && ( 
                <h3 className="text-3xl text-secondary-600 text-center m-4">
                    Stranica koju ste tražili ne postoji.
                </h3>
            )}

            {lgScreen && <img src={desert_island} className="h-[90vh] m-auto -z-10" /> }
            <Link to="/" 
                className="btn-primary text-3xl text-center block xs:m-4 sm:m-8
                lg:m-0 lg:p-4 lg:w-auto lg:text-[6vh] lg:absolute lg:top-[55%] lg:left-[55vw]"
            >Početna</Link>
        </div>
    );
}
 
export default NotFound;