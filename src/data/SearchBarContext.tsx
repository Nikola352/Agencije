import { createContext, useEffect, useState } from "react";
import useAgencijeHomepageFetch from "../hooks/useAgencijeHomepageFetch";
import { SearchBarContextType, SearchBarFetchType, SearchBarGenericOption } from "./SearchBarTypes";
import { AgencijaHomepage } from "./Agencija";
import { Destinacija } from "./Destinacija";

export const AgencijaHomepageContext = createContext<SearchBarContextType<AgencijaHomepage> | null>(null);
export const DestinacijaContext = createContext<SearchBarContextType<Destinacija> | null>(null);


export function getSearchBarContext<T>(searchBarType: SearchBarGenericOption): React.Context<SearchBarContextType<T> | null>{
    switch (searchBarType) {
        case 'AgencijaHomepage':
            return AgencijaHomepageContext as React.Context<SearchBarContextType<T> | null>;
        case 'Destinacija':
            return DestinacijaContext as React.Context<SearchBarContextType<T> | null>;
    }
}

export function SearchBarProvider<T>({ children, searchBarType}: any){
    
    let searchBarFetch: SearchBarFetchType<T>;
    switch (searchBarType) {
        case 'AgencijaHomepage':
            searchBarFetch = useAgencijeHomepageFetch() as SearchBarFetchType<T>;
            break;
        case 'Destinacija':
            // TODO: assign searchBarFetchType<Destinacija> type to searchBarFetch
            searchBarFetch = useAgencijeHomepageFetch() as SearchBarFetchType<T>;
            break;
        default:
            return null;
    }

    const {data, error, isPending} = searchBarFetch;

    const [filteredData, setFilteredData] = useState(data);
    const [filterActive, setFilterActive] = useState(false);

    useEffect(() => {
        if(!filterActive){
            setFilteredData(data);
        }
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
                filterActive,
                setFilterActive
            }}
        >
            { children }
        </SBProvider>
    );
}
