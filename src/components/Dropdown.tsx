import { useState } from "react";
import down_arrow from "../assets/icons/down-arrow.svg";
import up_arrow from "../assets/icons/up_arrow.svg";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

type DropdownProps = {
    name: string,
    options: string[],
    value: string,
    setValue: (val: string) => void,
}

const Dropdown = ({name, options, value, setValue}: DropdownProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger onClick={() => {setOpen(!open)}}>
                <button className={`w-48 m-2 flex justify-center items-center text-lg rounded-lg pl-3 border
                    ${open ? ' border-2' : ''}
                    ${!value ? ' border-secondary-400' : ' bg-primary-500 border-primary-500 text-white font-semibold'}`}>
                    <span className="mx-auto">{!value ? name : value}</span>
                    <img src={open ? up_arrow : down_arrow} alt="" className="inline-block w-8 h-8" />
                </button>
            </PopoverTrigger>

            <PopoverContent
                animationOptions={{ // dropdown animation
                    initial: { opacity: 0, y: -10 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -10 },
                    transition: { type: "spring", duration: 0.5 }
                }}
            >
                    <ul className="z-20 w-48 relative text-lg bg-white rounded-lg border border-secondary-400">
                        <li onClick={() => {setValue(""); setOpen(false)}}
                        className="p-2 text-center cursor-pointer hover:bg-secondary-200">
                            (nije odabrano)
                        </li>
                        {options.map((opt, idx) => (
                            <li key={idx} onClick={() => {setValue(opt); setOpen(false)}}
                            className={"p-2 text-center cursor-pointer hover:bg-secondary-200" + (opt===value ? " border-2 border-primary-500" : "")}>
                                {opt}
                            </li>
                        ))}
                    </ul>
            </PopoverContent>
        </Popover>
    );
}
 
export default Dropdown;