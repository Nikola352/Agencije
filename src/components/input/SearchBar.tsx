import Fuse from "fuse.js";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SearchBarContextType, SearchBarGenericOption } from "../../data/SearchBarTypes";
import { getSearchBarContext } from "../../data/SearchBarContext";
import search_icon from '../../assets/icons/search-icon-secondary.svg'
import x_icon from '../../assets/icons/x-icon-secondary.svg'
import search_icon_active from '../../assets/icons/search-icon-primary.svg'
import x_icon_active from '../../assets/icons/x-icon-primary.svg'
import Dropdown from "../floating/Dropdown";

type SearchBarProps<T> = {
    searchBarType: SearchBarGenericOption
    options: {
        // fusejs keys to be matched with the main search field
        searchFields: Fuse.FuseOptionKey<T>[] | undefined; 

        // properties on object for which seperate select dropdowns will be created
        // { property: array of possible values }
        selectFields: [string, string[]][]
    },
    placeholder: string
}

function SearchBar<T>({options, searchBarType, placeholder}: SearchBarProps<T>){
    const {data, filteredData, setFilteredData} 
        = useContext(getSearchBarContext<T>(searchBarType)) as SearchBarContextType<T>;
    const [searchQuery, setSearchQuery] = useState("");

    const [selectState, setSelectState] = useState<{[key:string]: string}>(
        Object.fromEntries(Object.keys(options.selectFields).map(k => [k, ""]))
    );

    const setSelectField = (field: string, value: string) => {
        setSelectState({...selectState, [field]: value});
    }

    const [fuseResult, setFuseResult] = useState<Fuse.FuseResult<T>[] | null>(null);

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

    const markMatches = useCallback((data: T[]|null) => {
        // change values inside data, so that matching substring is highlighted (xxxMatchxxx -> xxx<mark>Match</mark>xxx)
        if(!data) return null;
        if(fuseResult){
            let newData = JSON.parse(JSON.stringify(data)) as T[];
            newData = newData.map((d) => {
                const dString = JSON.stringify(d);
                for(const fr of fuseResult){
                    if(JSON.stringify(fr.item) == dString){
                        for(const match of fr.matches || []){
                            let valueString = match.value;
                            if(!valueString) continue;
                            // split valueString into substrings, each of which is either a match or not
                            // then join them with <mark> tags
                            let substrings = [];
                            let isMarked = []
                            for(const [start, end] of match.indices || []){
                                if(start == end) continue;
                                substrings.push(valueString.substring(0, start));
                                isMarked.push(false);
                                substrings.push(valueString.substring(start, end+1));
                                isMarked.push(true);
                                valueString = valueString.substring(end+1);
                            }
                            substrings.push(valueString);
                            isMarked.push(false);

                            valueString = "";
                            for(const substring of substrings){
                                valueString += isMarked.shift() ? `<mark>${substring}</mark>` : substring;
                            }
                            if(match.key)
                                (d as Record<string,any>)[match.key] = valueString;
                        }
                        break;
                    }
                }
                return d;
            });
            return newData;
        } 
        return data;
    }, [fuseResult]);
    
    const applySelectFilters = useCallback((data: T[]|null) => {
        if(!data) return null;
        return data.filter((fr) => {
            for(const [key, value] of Object.entries(selectState)){
                if(value != "" && (fr as Record<string,any>)[key] != value)
                    return false;
            }
            return true;
        })
    }, [selectState]);

    const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(searchQuery == ""){
            setFuseResult(null);
            setFilteredData(applySelectFilters(data));
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
                threshold: 0
            });
            const fuseResult = fuse.search(searchQuery.trim());
            setFuseResult(fuseResult);
        }
    }, [searchQuery, data, selectState]);

    useEffect(() => {
        if(fuseResult){
            let fuseResultData = applySelectFilters(fuseResult.map((fr) => fr.item));
            fuseResultData = markMatches(fuseResultData);
            setFilteredData(fuseResultData);
        } else {
            setFilteredData(applySelectFilters(data));
        }
    }, [selectState, fuseResult])

    const clearInput = () => {
        setSearchQuery("");
        setSelectState(Object.fromEntries(Object.keys(options.selectFields).map(k => [k, ""])));
        setFuseResult(null);
        setFilteredData(data);
    }

    return ( 
        <form id="search-bar" onSubmit={handleSearch}
            className="w-full pb-8 xs:px-4 sm:p-4 lg:px-16 xl:px-24 flex flex-col items-center lg:flex-row justify-start"
        >
            <div id="searchbar" className="flex justify-end w-full">
                <input 
                    type="search" name="search-query" 
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
                        placeholder:text-secondary-400
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
            </div>
            <div id="selects" className="flex flex-col items-center xs:flex-row justify-around mt-2 lg:ml-4">
                {
                    options.selectFields.map(([field, values]) => (
                        <Dropdown
                            key={field}
                            name={field}
                            options={values}
                            value={selectState[field]}
                            setValue={(value) => setSelectField(field, value)}
                        />
                    ))
                }
            </div>
        </form>
    );
}
 
export default SearchBar;