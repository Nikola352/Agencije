import { useEffect, useState } from "react";
import { Agencija, AgencijaHomepage } from "../data/Agencija";
import useDBFetch from "./useDBFetch";
import { Destinacija } from '../data/Destinacija';

type AgencijeHomepageFetchReturn = {
    data: AgencijaHomepage[] | null;
    error: string | null;
    isPending: boolean;
}

const useAgencijeHomepageFetch = () : AgencijeHomepageFetchReturn => {
    const [data, setData] = useState<AgencijaHomepage[] | null>(null);
    const [error, setError] = useState<string|null>(null);
    const [isPending, setIsPending] = useState(true);

    const {data: agencije, error: errA, isPending: ipa} = useDBFetch<{[key:string]: Agencija;}>("agencije");

    const {data: destinacije, error: errD, isPending: ipd} = useDBFetch<{[key:string]: {[key:string]: Destinacija;}}>("destinacije");
    
    useEffect(() => {
        if(errA) {
            setError(errA);
            setIsPending(false);
        }
        else 
        {
            let res = [] as AgencijaHomepage[]
        
            for(let id in agencije){
                res.push({
                    id: id,
                    naziv: agencije[id].naziv,
                    logo: agencije[id].logo,
                    destinacijeID: agencije[id].destinacije,
                    destinacijeList: [] as [string, Destinacija][],
                    destinacijeErr: errD,
                    destinacijePending: ipd
                });
            }
            setData(res);
            setIsPending(false);
            setError(null);
        }    
    }, [agencije, errA, ipa]);  
    
    useEffect(() => {
        if(data){
            for(let currAg of data){
                if(!errD && destinacije && currAg.destinacijeID in destinacije){
                    currAg.destinacijeList = Object.entries(destinacije[currAg.destinacijeID]);
                }
            }
            setData(data);
        }
    }, [destinacije, errD, ipd]);
    
    return {data, error, isPending};
}

export default useAgencijeHomepageFetch;