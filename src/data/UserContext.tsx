import { createContext, useEffect, useState } from "react";
import { User } from './User';
import useDBFetch from "../hooks/useDBFetch";
import useDBWrite from "../hooks/useDBWrite";

export type UserContextType = {
    currentUser: User | null;
    currentUserID: string | null;
    login: (id: string) => void;
    logout: () => void
    allUsers: {[key: string]: User;} | null;
    addUser: (user: User) => void;
    removeUser: (id: string) => void;
    updateUser: (id:string, user:User) => void;
    userFetchPending: boolean;
    userFetchError: string | null;
    userWritePending: boolean;
    userWriteError: string | null;
    addedUID: string | null;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: any) => {
    const [currentUser, setCurrentUser] = useState<User|null>(null);
    const [currentUserID, setCurrentUserID] = useState<string|null>(null);
    
    const {data: allUsers, error, isPending, setData: setAllUsers} = useDBFetch<{[key:string]: User}>("korisnici");

    const {write: dbWriteUser, isPending: userWritePending, error: userWriteError, key: uid, writtenData: tuser} = useDBWrite<User>("korisnici");
    const [isWritePending, setIsWritePending] = useState(false);

    const addUser = (user: User) => {
        setIsWritePending(true);
        dbWriteUser(user);
    }

    useEffect(() => {
        if(!userWritePending && uid && tuser){
            setAllUsers({
                ...allUsers,
                [uid]: tuser
            });
        }

    }, [userWritePending, uid, tuser]);

    useEffect(() => {
        if(!userWritePending && uid && tuser && allUsers){
            if(uid in allUsers){
                setIsWritePending(false);
            }
        }
    }, [allUsers]);

    const removeUser = () => {
        // TODO:
    }

    const updateUser = (id: string, user: User) => {
        // TODO:
    }

    const login = (id:string) => {
        if(allUsers && id in allUsers){
            setCurrentUser(allUsers[id]);
            setCurrentUserID(id);
        }
    }

    const logout = () => {
        setCurrentUser(null);
        setCurrentUserID(null);
    }

    return (
        <UserContext.Provider
            value={{
                currentUser,
                currentUserID,
                login,
                logout,
                allUsers,
                addUser,
                removeUser,
                updateUser,
                userFetchPending: isPending,
                userFetchError: error,
                userWritePending: isWritePending,
                userWriteError,
                addedUID: uid
            }}
        >
            { children }
        </UserContext.Provider>
    )
}