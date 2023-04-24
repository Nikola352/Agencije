import { useEffect, useState } from "react";
import { db } from "../firebase";
import { set, ref } from "firebase/database";

type DBRemoveFromReturn<T> = {
    remove: (key: string) => void
    isPending: boolean;
    error: string | null;
}

const useDBRemoveFrom = <T>(dbpath: string): DBRemoveFromReturn<T> => { 
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string|null>(null);
    
    let remove = async (key: string) => {
        setIsPending(true);
        try{
            await set(ref(db, `${dbpath}/${key}`), null);
        } catch(err){
            setError((err as Error).message);
        } finally{
            setIsPending(false);
        }
    }

    useEffect(() => {
        remove = async (key: string) => {
            setIsPending(true);
            try{
                await set(ref(db, `${dbpath}/${key}`), null);
            } catch(err){
                setError((err as Error).message);
            } finally{
                setIsPending(false);
            }
        }
    }, [dbpath]);

    return { remove, isPending, error }
}

export default useDBRemoveFrom;