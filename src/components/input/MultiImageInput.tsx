import { useCallback, useEffect, useState } from "react";
import TextInput from "./TextInput";

type MultiImageInputProps = {
    urls: string, // comma separated
    setUrls: (value: string) => void,
}

const MultiImageInput = ({urls, setUrls}: MultiImageInputProps) => {
    const [urlList, setUrlList] = useState<string[]>(urls.split(',').map(s => s.trim()));
    const [selectedIdx, setSelectedIdx] = useState<number>(0);

    useEffect(() => {
        setUrlList(urls.split(',').map(s => s.trim()));
    }, [urls]);

    const setUrl = (url: string, idx: number) => {
        console.log(1);
        const newList = [...urlList];
        newList[idx] = url;
        setUrls(newList.join(', '));
    };

    const removeUrl = (idx: number) => {
        const newList = urlList.filter((_, i) => i !== idx);
        setUrls(newList.join(', '));
        setSelectedIdx(0);
    };

    const addImage = () => {
        console.log(1);
        const newList = [...urlList, ""]
        setUrls([...newList].join(', '));
        setSelectedIdx(urlList.length);

        // set focus on new input
        setTimeout(() => {
            const inputs = document.querySelectorAll("input[type='url']") as NodeListOf<HTMLInputElement>;
            const lastInput = inputs[inputs.length - 1];
            lastInput.focus();
        } , 0);
    };

    return ( 
        <div className="w-full">
            <div className="flex flex-col lg:flex-row w-full items-center justify-center p-4">
                <img src={urlList[selectedIdx]} alt="no image" className="object-cover w-96 h-72 lg:w-[34rem] lg:h-96 rounded-lg shadow-md bg-secondary-200" />
                <ul className="max-h-96 w-80 overflow-y-scroll">
                    {urlList.map((url, idx) => (
                        <li key={idx} className="flex flex-row" onMouseDown={() => setSelectedIdx(idx)}>
                            <TextInput
                                value={url}
                                setValue={(val) => setUrl(val, idx)}
                                type="url"
                                />
                            <button type="button" onClick={() => removeUrl(idx)} className="text-error">X</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <button type="button" onClick={addImage} className="btn-primary">Dodaj sliku</button>
            </div>
        </div>
    );
}
 
export default MultiImageInput;