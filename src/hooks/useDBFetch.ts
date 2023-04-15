import { useEffect, useState } from "react";
import { db } from "../firebase";
import { get, ref } from "firebase/database";

type DBFetchReturn<T> = {
    data: T | null;
    isPending: boolean;
    error: string | null;
    setData: React.Dispatch<React.SetStateAction<T | null>>; // for changing data after initial load
}

const useDBFetch = <T>(dbpath: string): DBFetchReturn<T> => {  
    const [data, setData] = useState<T|null>(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const snapshot = await get(ref(db, dbpath));
                if(snapshot.exists()){
                    setData(snapshot.val());
                    setIsPending(false);
                    setError(null);
                } else {
                    throw Error("Could not fetch data.")
                }
            } catch(err){
                setError((err as Error).message);
                setIsPending(false);
            }
        }
        fetchData();
    }, [dbpath]);

    return { data, isPending, error, setData }
}

export default useDBFetch;