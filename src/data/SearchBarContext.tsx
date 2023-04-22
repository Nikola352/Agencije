import { createContext, useEffect, useMemo, useState } from "react";
import useAgencijeHomepageFetch from "../hooks/useAgencijeHomepageFetch";
import { SearchBarContextType, SearchBarFetchType, SearchBarGenericOption } from "./SearchBarTypes";
import { AgencijaHomepage } from "./Agencija";
import { DestinacijaSB } from "./Destinacija";
import useDestinacijaSBFetch from "../hooks/useDestinacijaSBFetch";

export const AgencijaHomepageContext = createContext<SearchBarContextType<AgencijaHomepage> | null>(null);
export const DestinacijaContext = createContext<SearchBarContextType<DestinacijaSB> | null>(null);


export function getSearchBarContext<T>(searchBarType: SearchBarGenericOption): React.Context<SearchBarContextType<T> | null>{
    switch (searchBarType) {
        case 'AgencijaHomepage':
            return AgencijaHomepageContext as React.Context<SearchBarContextType<T> | null>;
        case 'Destinacija':
            return DestinacijaContext as React.Context<SearchBarContextType<T> | null>;
    }
}

export function SearchBarProvider<T>({ children, searchBarType, destID}: any){
    
    let searchBarFetch: SearchBarFetchType<T>;
    switch (searchBarType) {
        case 'AgencijaHomepage':
            searchBarFetch = useAgencijeHomepageFetch() as SearchBarFetchType<T>;
            break;
        case 'Destinacija':
            searchBarFetch = useDestinacijaSBFetch(destID) as SearchBarFetchType<T>;
            break;
        default:
            return null;
    }

    const {data, error, isPending} = searchBarFetch;

    const [filteredData, setFilteredData] = useState(data);
    
    const filterActive = useMemo(() => {
        return filteredData != data;
    }, [filteredData, data]);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const SBProvider = getSearchBarContext<T>(searchBarType).Provider;

    return ( 
        <SBProvider
            value={{
                data,
                filteredData,
                setFilteredData,
                error,
                isPending,
                filterActive
            }}
        >
            { children }
        </SBProvider>
    );
}
