type TextInputProps = {
    value: string,
    setValue: (value: string) => void,
    label?: string | undefined,
    name?: string | undefined,
    error?: string | null,
    required?: boolean,
    type?: "text" | "password" | "email" | "number" | "tel" | "url" | "date" | "time" | "datetime-local" | "month" | "week" | "search" | "color" | "range" | "file" | "image" | "submit" | "reset" | "button" | undefined,
    // for number type:
    min?: number,
    max?: number,
}

const TextInput = ({value, setValue, label, name, error=null, required=false, type="text", min, max}: TextInputProps) => {
    return ( 
        <div className="text-input relative m-6">
            <input 
                type={type}
                name={name} required={required}
                placeholder={label}
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
                min={min} max={max}
                className={`text-secondary-600 h-10 text-lg
                    focus:outline-none focus:border-primary-500 border-b-2
                    peer placeholder:text-transparent
                    ${error ? 'border-error': ''}`}
            />
            {label && (
                <label htmlFor={name}
                    className="absolute left-0 -top-3.5 text-secondary-400 text-sm transition-all
                        peer-placeholder-shown:text-base peer-placeholder-shown:top-2
                        peer-focus:-top-3.5 peer-focus:text-sm
                        pointer-text pointer-events-none"
                >{label}</label>
            )}
            {error && (
                <p className="text-sm text-error">{error}</p>
            )}
        </div>
    );
}
 
export default TextInput;