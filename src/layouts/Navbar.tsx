import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logo_horizontal from '../assets/logo-horizontal.png'
import menu_icon from '../assets/menu-icon-primary.svg'

const Navbar = () => {

    const [width, setWidth] = useState(window.innerWidth);
    const breakpoint = 640;

    const [menuActive, setMenuActive] = useState(false);

    useEffect(() => {
        const handleWindowResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    return ( 
        <div id="Navbar">
            <nav id="topbar" className="sticky flex justify-end items-center h-12 sm:h-16 bg-secondary-600 w-full text-white p-2 z-10">
                <Link to="/" className="mr-auto" onClick={() => setMenuActive(false)}>
                    <img src={logo_horizontal} alt="logo" className="sm:h-10 h-8" />
                </Link>

                {width >= breakpoint && (<Link to="/admin" className="btn m-2">Admin</Link>)}
                {width >= breakpoint && (<button className="btn-primary m-2">Prijava</button>)}
                {width >= breakpoint && (<button className="btn-primary m-2">Registracija</button>)}

                {/* menu button opens navigation drawer on smaller screens */}
                { width < breakpoint && (
                    <motion.img src={menu_icon} className="sm:h-10 h-8" 
                        onClick={() => setMenuActive(!menuActive)}
                        animate={{rotate: menuActive ? 90 : 0}}
                        transition={{duration: 0.2, type: "tween"}}
                    />
                )}

                {/* navigation drawer with animations */}
                <AnimatePresence>
                { width < breakpoint && menuActive && (
                    <motion.div 
                        id="nav-drawer"
                        initial={{height: 0}}
                        animate={{height: 'unset', transition: {duration: 0.2}}}
                        exit={{height: 0, transition: {delay: 0.05, duration: 0.2}}}
                        className="absolute top-12 left-0 bg-secondary-600 w-full px-4 rounded-b-lg flex flex-col justify-start items-center"
                    >
                        <motion.div 
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.1, delay: 0.05 }}
                            exit={{ x: -100, opacity: 0, transition: {duration: 0.1, delay: 0.15}}}
                            className="w-3/4 m-4 mt-8"
                        >
                            <Link to="/" 
                                onClick={() => setMenuActive(false)} 
                                className="btn w-full text-center block"
                            >Početna</Link>
                        </motion.div>

                        <motion.div 
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.1, delay: 0.1 }}
                            exit={{ x: -100, opacity: 0, transition: {duration: 0.1, delay: 0.1}}}
                            className="w-3/4 m-4"
                        >
                            <Link to="/admin" 
                                onClick={() => setMenuActive(false)} 
                                className="btn w-full text-center block"
                            >Admin</Link>
                        </motion.div>

                        <motion.div 
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.1, delay: 0.15 }}
                            exit={{ x: -100, opacity: 0, transition: {duration: 0.1, delay: 0.05}}}
                            className="w-3/4 m-4"
                        >
                            <button className="btn-primary w-full">Prijava</button>
                        </motion.div>

                        <motion.div 
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.1, delay: 0.2 }}
                            exit={{ x: -100, opacity: 0, transition: {duration: 0.1}}}
                            className="w-3/4 m-4 mb-8"
                        >
                            <button className="btn-primary w-full">Registracija</button>
                        </motion.div>
                    </motion.div>
                )}
                </AnimatePresence>

            </nav>
            
            {/* inactive background overlay */}
            {width < breakpoint && menuActive && (
                <div 
                    className="fixed top-0 bottom-0 left-0 right-0 bg-backdrop"
                    onClick={() => setMenuActive(!menuActive)}
                ></div>
            )}
        </div>
     );
}
 
export default Navbar;