import { useState } from "react";
import { db } from "../firebase";
import { push, ref } from "firebase/database";

type DBWriteReturn<T> = {
    write: (data: T) => void
    isPending: boolean;
    error: string | null;
    key: string | null;
    writtenData: T|null;
}

const useDBWrite = <T>(dbpath: string): DBWriteReturn<T> => { 
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string|null>(null);
    const [key, setKey] = useState<string|null>(null);
    const [writtenData, setWrittenData] = useState<T|null>(null);
    
    const write = async (data: T) => {
        setIsPending(true);
        try{
            setWrittenData(data);
            const dataRef = await push(ref(db, dbpath), data);
            setKey(dataRef.key);
        } catch(err){
            setError((err as Error).message);
        } finally{
            setIsPending(false);
        }
    }

    return { write, isPending, error, key, writtenData }
}

export default useDBWrite;