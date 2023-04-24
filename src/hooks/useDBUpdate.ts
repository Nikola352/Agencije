import { useState } from "react";
import { db } from "../firebase";
import { set, ref } from "firebase/database";

type DBUpdateReturn<T> = {
    update: (data: T) => void
    isPending: boolean;
    error: string | null;
    writtenData: T|null;
}

const useDBUpdate = <T>(dbpath: string): DBUpdateReturn<T> => { 
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string|null>(null);
    const [writtenData, setWrittenData] = useState<T|null>(null);
    
    const update = async (data: T) => {
        setIsPending(true);
        try{
            setWrittenData(data);
            await set(ref(db, dbpath), data);
        } catch(err){
            setError((err as Error).message);
        } finally{
            setIsPending(false);
        }
    }

    return { update, isPending, error, writtenData }
}

export default useDBUpdate;