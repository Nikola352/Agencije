import { Link } from "react-router-dom";
import { Agencija } from "../data/Agencija";
import { User } from "../data/User";
import useDBFetch from "../hooks/useDBFetch";
import { useEffect, useState } from "react";
import useDBRemoveFrom from "../hooks/useDBRemoveFrom";
import { Dialog } from "../components/floating/Dialog";
import { DialogContent } from "../components/floating/Dialog";

import delete_icon from "../assets/icons/delete-icon-white.svg";
import delete_icon_active from "../assets/icons/delete-icon-error.svg";
import edit_icon from "../assets/icons/edit-icon-white.svg";
import edit_icon_active from "../assets/icons/edit-icon-accent.svg";
import UserEdit from "../layouts/UserEdit";

const Admin = () => {
    const { data: users, error: uErr, isPending: uPending } = useDBFetch<{[key:string]: User}>('korisnici');
    const { data: agencije, error: aErr, isPending: aPending } = useDBFetch<{[key:string]: Agencija}>('agencije');

    const [showUsers, setShowUsers] = useState(true); // true - users, false - agencije

    const {remove: removeUser, isPending: removeUserPending, error: removeUserError} = useDBRemoveFrom('korisnici');
    const {remove: removeAgencija, isPending: removeAgencijaPending, error: removeAgencijaError} = useDBRemoveFrom('agencije');

    const [isPresentUser, setIsPresentUser] = useState<{[key:string]: boolean}>({});
    const [isPresentAgencija, setIsPresentAgencija] = useState<{[key:string]:boolean}>({});

    useEffect(() => {
        if (users) {
            setIsPresentUser((prev) => {
                const newObj = {...prev};
                Object.keys(users).forEach((key) => {
                    newObj[key] = true;
                });
                return newObj;
            });
        }
    }, [users]);

    useEffect(() => {
        if (agencije) {
            setIsPresentAgencija((prev) => {
                const newObj = {...prev};
                Object.keys(agencije).forEach((key) => {
                    newObj[key] = true;
                });
                return newObj;
            });
        }
    }, [agencije]);

    const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
    const [deleteAgencijaDialogOpen, setDeleteAgencijaDialogOpen] = useState(false);

    const [currentUserToDelete, setCurrentUserToDelete] = useState('');
    const [currentAgencijaToDelete, setCurrentAgencijaToDelete] = useState('');

    const deleteUser = () => {
        if(!currentUserToDelete) return;
        removeUser(currentUserToDelete);
        setIsPresentUser((prev) => {
            const newObj = {...prev};
            delete newObj[currentUserToDelete];
            return newObj;
        });
        setDeleteUserDialogOpen(false);
    }

    const deleteAgencija = () => {
        if(!currentAgencijaToDelete) return;
        removeAgencija(currentAgencijaToDelete);
        setIsPresentAgencija((prev) => {
            const newObj = {...prev};
            delete newObj[currentAgencijaToDelete];
            return newObj;
        });
        setDeleteAgencijaDialogOpen(false);
    }

    return ( 
        <div>
            <div className="flex justify-end flex-wrap">
                <h1 className="text-3xl fancy-underline font-semibold mb-8 ml-4 mr-auto">Admin panel</h1>

                <button 
                    className="text-xl btn-primary m-4"
                    onClick={() => setShowUsers(true)}
                > Korisnici </button>

                <button 
                    className="text-xl btn-primary m-4"
                    onClick={() => setShowUsers(false)}
                > Agencije </button>
            </div>

            {showUsers &&
                <ul className="mb-6 text-xl">
                    {uPending && <div>Učitavanje korisnika...</div>}
                    {uErr && <div>Došlo je do greške pri učitavanju korisnika</div>}
                    {
                        users && Object.keys(users).map((key) => {
                            return isPresentUser[key] && (
                                <li key={key} className="m-2 px-4 py-1 flex justify-end items-center bg-primary-300 rounded-lg md:w-1/2">
                                    <Link to={`/korisnik/${key}`} className="mr-auto ml-4 text-white text-2xl font-bold clickable-shadow">
                                        {users[key].korisnickoIme}
                                    </Link>
                                    <UserEdit id={key}/>
                                    <button
                                        onClick={() => {setDeleteUserDialogOpen(true); setCurrentUserToDelete(key)}}
                                    >
                                        <img src={delete_icon} alt="obriši" 
                                            className="w-10 h-10"
                                            onMouseOver={e => e.currentTarget.src = delete_icon_active}
                                            onMouseOut={e => e.currentTarget.src = delete_icon} 
                                        />
                                    </button>
                                </li>
                            )
                        })
                    }
                </ul>
            }

            {users && currentUserToDelete && (
                <Dialog open={deleteUserDialogOpen} onOpenChange={() => setDeleteUserDialogOpen(!deleteUserDialogOpen)}>
                    <DialogContent className="bg-white rounded-lg p-4 text-center">
                        <p className="text-xl mb-4">Da li ste sigurni da želite da obrišete korisnika {users[currentUserToDelete].korisnickoIme}?</p>
                        <button
                            onClick={() => setDeleteUserDialogOpen(false)}
                            className="btn text-secondary-600 hover:text-white font-semibold m-2 w-1/3"
                        >Odustani</button>
                        <button 
                            onClick={() => deleteUser()}
                            className="btn-error m-2 w-1/3"
                            >Obriši</button>
                    </DialogContent>
                </Dialog>
            )}

            {!showUsers &&
                <ul className="mb-6 text-xl">
                    {aPending && <div>Učitavanje agencija...</div>}
                    {aErr && <div>Došlo je do greške pri učitavanju agencija</div>}
                    {
                        agencije && Object.keys(agencije).map((key) => {
                            return isPresentAgencija[key] && (
                                <li key={key} className="m-2 px-4 py-1 flex justify-end items-center bg-primary-300 rounded-lg  md:w-1/2">
                                    <Link to={`/agencija/${key}`} className="mr-auto ml-4 text-white text-2xl font-bold clickable-shadow">
                                        {agencije[key].naziv}
                                    </Link>
                                    <Link to={`/agencija/${key}/edit`}>
                                        <button className="ml-2">
                                        <img src={edit_icon} alt="izmeni" 
                                            className="w-10 h-10"
                                            onMouseOver={e => e.currentTarget.src = edit_icon_active}
                                            onMouseOut={e => e.currentTarget.src = edit_icon} 
                                        />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => {setDeleteAgencijaDialogOpen(true); setCurrentAgencijaToDelete(key)}}
                                    >
                                        <img src={delete_icon} alt="obriši" 
                                            className="w-10 h-10"
                                            onMouseOver={e => e.currentTarget.src = delete_icon_active}
                                            onMouseOut={e => e.currentTarget.src = delete_icon} 
                                        />
                                    </button>
                                </li>
                            );
                        })
                    }
                </ul>
            }

            {agencije && currentAgencijaToDelete && (
                <Dialog open={deleteAgencijaDialogOpen} onOpenChange={() => setDeleteAgencijaDialogOpen(!deleteAgencijaDialogOpen)}>
                    <DialogContent className="bg-white rounded-lg p-4 text-center">
                        <p className="text-xl mb-4">Da li ste sigurni da želite da obrišete agenciju {agencije[currentAgencijaToDelete].naziv}?</p>
                        <button
                            onClick={() => setDeleteAgencijaDialogOpen(false)}
                            className="btn text-secondary-600 hover:text-white font-semibold m-2 w-1/3"
                        >Odustani</button>
                        <button 
                            onClick={() => deleteAgencija()}
                            className="btn-error m-2 w-1/3"
                            >Obriši</button>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    );
}
 
export default Admin;