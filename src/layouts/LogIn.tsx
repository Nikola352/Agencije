import { Dialog, DialogContent, DialogTrigger } from "../components/floating/Dialog";
import { useCallback, useContext, useMemo, useState } from "react";
import TextInput from "../components/input/TextInput";
import useForm from "../hooks/useForm";
import { UserContext, UserContextType } from "../data/UserContext";
import loader_icon from "../assets/icons/loader-icon.svg"

type LoginProps = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    switchToSignUp: () => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const LogIn = ({open, setOpen, switchToSignUp, ...props}: LoginProps) => {

    const {login: loginUser, allUsers, userFetchPending} = useContext(UserContext) as UserContextType;

    const fields = ["username", "password"] as const;
    const initialValues = Object.fromEntries(fields.map(k => [k, ""])) as {[k in typeof fields[number]]: string}
    const validators = {
        username: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Korisničko ime ne sme sadržati razmak", (val: string) => !val.includes(' ')]
        ],
        password: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Lozinka mora sadržati bar 8 karaktera", (val: string) => val.length >= 8]
        ]
    } as {[k in typeof fields[number]]: [string, (val:string)=>boolean][]}

    const {fieldValues, errors, setFieldValue, setError, validate, clearForm, clearErrors} 
        = useForm(fields, initialValues, validators);

    const [formSubmitted, setformSubmitted] = useState(false);
    const isPending = useMemo(() => {
        return userFetchPending && formSubmitted
    }, [userFetchPending, formSubmitted]);

    const login = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validate()){
            clearErrors();
            setformSubmitted(true);
            if(!isPending){
                let userFound = false;
                for(let id in allUsers){
                    if(allUsers[id].korisnickoIme.trim() === fieldValues["username"]){
                        if(allUsers[id].lozinka === fieldValues["password"]){
                            loginUser(id);
                            closeDialog();
                        } else {
                            setError("password", "Pogrešna lozinka");
                        }
                        userFound = true;
                        break;
                    }
                }
                if(!userFound){
                    setError("username", "Nepostojece korisnicko ime");
                }
            }
            setformSubmitted(false);
        }

    }, [fieldValues]);

    const closeDialog = () => {
        clearForm();
        setOpen(false);
    }

    return ( 
        <Dialog open={open} onOpenChange={closeDialog}>
            <DialogTrigger onClick={() => setOpen(!open)} disabled={isPending} {...props}>Prijava</DialogTrigger>

            <DialogContent className="bg-white p-4 rounded-lg flex items-center flex-col">
                <h2 className="text-xl fancy-underline">Prijava</h2>
                <form className="m-2" onSubmit={login} noValidate>
                    <TextInput
                        value={fieldValues["username"]}
                        setValue={(val:string) => setFieldValue("username", val)}
                        label="Korisnicko ime"
                        error={errors["username"]}
                        required
                    />
                    <TextInput
                        value={fieldValues["password"]}
                        setValue={(val:string) => setFieldValue("password", val)}
                        type="password"
                        label="Lozinka"
                        error={errors["password"]}
                        required
                    />

                    <div className="form-controls flex justify-around">
                        <button type="button" onClick={() => {closeDialog(); switchToSignUp();}} className="text-secondary-400 hover:text-primary-500 font-semibold">
                            Registracija
                        </button>
                        <button type="submit" className={"btn-primary text-lg" + (formSubmitted? 'bg-primary-500 h-12 w-[5.5rem] p-0' : '')} 
                            disabled={formSubmitted || userFetchPending}>
                            {formSubmitted ? (
                                <img src={loader_icon} alt="Processing..." className="h-full m-auto" />
                            ) : "Prijava"}
                        </button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}
 
export default LogIn;