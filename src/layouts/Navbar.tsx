import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logo_horizontal from '../assets/logo/logo-horizontal.png'
import menu_icon from '../assets/icons/menu-icon-primary.svg'
import useRenderOnScreenSize from "../hooks/useRenderOnScreenSize";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import { UserContext, UserContextType } from "../data/UserContext";

const Navbar = () => {
    const smScreen = useRenderOnScreenSize(640);
    const [menuActive, setMenuActive] = useState(false);

    const {currentUser, logout} = useContext(UserContext) as UserContextType;
    const [loginOpen, setLoginOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);

    return ( 
        <div id="Navbar" className="fixed w-full z-10">
            <nav id="topbar" className="fixed flex justify-end items-center h-12 sm:h-16 bg-secondary-600 w-full text-white p-2 z-10">
                <Link to="/" className="mr-auto" onClick={() => setMenuActive(false)}>
                    <img src={logo_horizontal} alt="logo" className="sm:h-10 h-8" />
                </Link>

                {smScreen && (<Link to="/admin" className="btn mx-2">Admin</Link>)}
                
                {smScreen && !currentUser && (
                    <LogIn 
                        open={loginOpen} setOpen={setLoginOpen} 
                        switchToSignUp={() => {setSignupOpen(true)}} 
                        className="btn-primary mx-2"
                    ></LogIn>
                )}
                {smScreen && !currentUser && (
                    <SignUp 
                        open={signupOpen} setOpen={setSignupOpen} 
                        switchToLogIn={() => {setLoginOpen(true)}} 
                        className="btn-primary mx-2"
                    ></SignUp>
                )}

                {smScreen && currentUser && (<button className="btn-primary mx-2" onClick={logout}>Log out</button>)}

                {/* menu button opens navigation drawer on smaller screens */}
                { !smScreen && (
                    <motion.img src={menu_icon} className="sm:h-10 h-8" 
                        onClick={() => setMenuActive(!menuActive)}
                        animate={{rotate: menuActive ? 90 : 0}}
                        transition={{duration: 0.2, type: "tween"}}
                    />
                )}

                {/* navigation drawer with animations */}
                <AnimatePresence>
                { !smScreen && menuActive && (
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

                        {!currentUser && (
                            <motion.div 
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.1, delay: 0.15 }}
                                exit={{ x: -100, opacity: 0, transition: {duration: 0.1, delay: 0.05}}}
                                className="w-3/4 m-4"
                            >
                                <LogIn 
                                    open={loginOpen} setOpen={setLoginOpen} 
                                    switchToSignUp={() => {setSignupOpen(true)}} 
                                    className="btn-primary w-full"
                                ></LogIn>
                            </motion.div>
                        )}

                        {!currentUser && (
                            <motion.div 
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.1, delay: 0.2 }}
                                exit={{ x: -100, opacity: 0, transition: {duration: 0.1}}}
                                className="w-3/4 m-4 mb-8"
                            >
                                <SignUp 
                                    open={signupOpen} setOpen={setSignupOpen} 
                                    switchToLogIn={() => {setLoginOpen(true)}} 
                                    className="btn-primary w-full"
                                ></SignUp>
                            </motion.div>
                        )}

                        {currentUser && (
                            <motion.div 
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.1, delay: 0.15 }}
                                exit={{ x: -100, opacity: 0, transition: {duration: 0.1, delay: 0.05}}}
                                className="w-3/4 m-4 mb-8"
                            >
                                <button className="btn-primary w-full" onClick={logout}>Log out</button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
                </AnimatePresence>

            </nav>
            
            {/* inactive background overlay */}
            {!smScreen && menuActive && (
                <div 
                    className="fixed top-0 bottom-0 left-0 right-0 bg-backdrop"
                    onClick={() => setMenuActive(!menuActive)}
                ></div>
            )}
        </div>
     );
}
 
export default Navbar;