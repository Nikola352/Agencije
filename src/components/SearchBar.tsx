import Fuse from "fuse.js";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SearchBarContextType, SearchBarGenericOption } from "../data/SearchBarTypes";
import { getSearchBarContext } from "../data/SearchBarContext";
import search_icon from '../assets/icons/search-icon-secondary.svg'
import x_icon from '../assets/icons/x-icon-secondary.svg'
import search_icon_active from '../assets/icons/search-icon-primary.svg'
import x_icon_active from '../assets/icons/x-icon-primary.svg'

type SearchBarProps<T> = {
    searchBarType: SearchBarGenericOption
    options: {
        // fusejs keys to be matched with the main search field
        searchFields: Fuse.FuseOptionKey<T>[] | undefined; 

        // properties on object for which seperate select dropdowns will be created
        // { property: array of possible values }
        selectFields: {[key:string]: string[]}[] 
    },
    placeholder: string
}

function SearchBar<T>({options, searchBarType, placeholder}: SearchBarProps<T>){
    const {data, setFilteredData, setFilterActive} 
        = useContext(getSearchBarContext<T>(searchBarType)) as SearchBarContextType<T>;
    const [searchQuery, setSearchQuery] = useState("");

    // doesn't work when defined with useMemo or useSate...
    // const fuse = useMemo(() => {
    //     if(data){
    //         return new Fuse(data, {
    //             includeScore: true,
    //             includeMatches: true, // ?
    //             keys: options.searchFields,
    //             ignoreLocation: true,
    //             threshold: 0.33
    //         });
    //     }
    // }, [data])

    const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(searchQuery == ""){
            setFilteredData(data);
            setFilterActive(false);
            return;
        }
        if(data){
            // only works if new fuse object is created on every search
            // it is inefficient, but doesn't work otherwise...
            const fuse = new Fuse(data, {
                includeScore: true,
                includeMatches: true, // ?
                keys: options.searchFields,
                ignoreLocation: true,
                threshold: 0.33
            });
            const fuseResult = fuse.search(searchQuery.trim());
            setFilteredData(fuseResult.map((fr) => fr.item));
            setFilterActive(true);
        }
    }, [searchQuery]);

    const clearInput = () => {
        setSearchQuery("");
        setFilteredData(data);
        setFilterActive(false);
    }

    return ( 
        <form id="search-bar" onSubmit={handleSearch}
            className="w-full pb-8 xs:px-4 sm:p-8 lg:px-16 xl:px-24 flex justify-end placeholder:text-secondary-400"
        >
            <input 
                type="text" name="search-query" 
                placeholder={placeholder}
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="
                    outline-none
                    w-full p-2 text-lg
                    border border-r-0 border-secondary-600 
                    rounded-xl rounded-r-none 
                    focus:border-primary-500
                    focus:border-2 focus:border-r-0
                    peer
                    "
            />
            <button type="reset" onClick={clearInput} className="border border-x-0 border-secondary-600
                peer-focus:border-primary-500 peer-focus:border-y-2">
                <img src={x_icon} alt="Search" className="text-secondary-600"
                    onMouseOver={e => e.currentTarget.src = x_icon_active}
                    onMouseOut={e => e.currentTarget.src = x_icon} />
            </button>
            <button type="submit" className="border border-l-0 border-secondary-600 rounded-r-xl
                peer-focus:border-primary-500 peer-focus:border-y-2 peer-focus:border-r-2">
                <img src={search_icon} alt="Search" className="text-secondary-600"
                    onMouseOver={e => e.currentTarget.src = search_icon_active}
                    onMouseOut={e => e.currentTarget.src = search_icon} />
            </button>
        </form>
    );
}
 
export default SearchBar;