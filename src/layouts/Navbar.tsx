import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo_horizontal from '../assets/logo-horizontal.png'
import logo from '../assets/logo-no-text.png'
import menu_icon from '../assets/menu-icon-white.svg'
import menu_icon_active from '../assets/menu-icon-primary.svg'

const Navbar = () => {

    const [width, setWidth] = useState(window.innerWidth);
    const breakpoint = 640;

    const [menuActive, setMenuActive] = useState(false);

    useEffect(() => {
        const handleWindowResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    useEffect(() => {
        document.addEventListener("click", e => {
            setMenuActive(false);
        });
    }, [])

    return ( 
            <nav id="Navbar" onClick={e => e.stopPropagation()}
                className="sticky flex justify-end items-center h-12 sm:h-16 bg-secondary-600 w-full text-white p-2">
                <Link to="/" className="mr-auto" onClick={() => setMenuActive(false)}>
                    { (width >= breakpoint || menuActive) ? (
                        <img src={logo_horizontal} alt="logo" className="sm:h-10 h-8" />
                    ) : (
                        <img src={logo} alt="logo" className="h-8" />
                    )}
                </Link>

                {width >= breakpoint && (<Link to="/admin" className="btn m-2">Admin</Link>)}
                {width >= breakpoint && (<button className="btn-primary m-2">Prijava</button>)}
                {width >= breakpoint && (<button className="btn-primary m-2">Registracija</button>)}

                { width < breakpoint && (
                    <img src={menu_icon} className="sm:h-10 h-8" 
                        onMouseOver={e => e.currentTarget.src = menu_icon_active}
                        onMouseOut={e => e.currentTarget.src = menu_icon}
                        onClick={() => setMenuActive(!menuActive)}
                    />
                )}

                { width < breakpoint && menuActive && (
                    <div className={`absolute top-12 left-0 flex flex-col justify-start items-center bg-secondary-600 w-full px-4 py-8 rounded-b-lg`}>
                        <Link to="/" 
                            onClick={() => setMenuActive(false)} 
                            className="btn w-3/4 m-4 text-center"
                        >Početna</Link>
                        <Link to="/admin" 
                            onClick={() => setMenuActive(false)} 
                            className="btn w-3/4 m-4 text-center"
                        >Admin</Link>
                        <button className="btn-primary w-3/4 m-4">Prijava</button>
                        <button className="btn-primary w-3/4 m-4">Registracija</button>
                    </div>
                )}
            </nav>
     );
}
 
export default Navbar;