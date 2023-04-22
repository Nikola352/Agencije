export type SearchBarContextType<T> = {
    data: T[] | null;
    filteredData: T[] | null;
    setFilteredData: React.Dispatch<React.SetStateAction<T[] | null>>;
    error: string | null;
    isPending: boolean;
    filterActive: boolean;
}

export type SearchBarFetchType<T> = {
    data: T[] | null;
    error: string | null;
    isPending: boolean;
}

export type SearchBarGenericOption = 'AgencijaHomepage' | 'Destinacija'