import { useEffect, useState } from "react";
import { Destinacija, DestinacijaSB } from "../data/Destinacija";
import useDBFetch from "./useDBFetch";

type DestinacijaSBFetchReturn = {
    data: DestinacijaSB[] | null;
    error: string | null;
    isPending: boolean;
}

const useDestinacijaSBFetch = (destID: string): DestinacijaSBFetchReturn => {
    const [data, setData] = useState<DestinacijaSB[] | null>(null);
    const [isPending, setIsPending] = useState(true);
    const {data: destinacije, error, isPending: dPending} = useDBFetch<{[key:string]: Destinacija;}>(`destinacije/${destID}`, [destID]);

    useEffect(() => {
        if(error) {
            setIsPending(false);
        }
        else if(destinacije)
        {
            let res = [] as DestinacijaSB[]
        
            for(let id in destinacije){
                res.push({
                    id: id,
                    naziv: destinacije[id].naziv,
                    cena: destinacije[id].cena,
                    prevoz: destinacije[id].prevoz,
                    tip: destinacije[id].tip,
                    thumbnail: destinacije[id].slike[0]
                });
            }
            setData(res);
            setIsPending(false);
        }    
    }, [destinacije, error, dPending]);  

    useEffect(() => {
        if(error && !dPending){
            setIsPending(false);
        }
    }, [dPending, error])

    return {data, error, isPending};
}

export default useDestinacijaSBFetch;