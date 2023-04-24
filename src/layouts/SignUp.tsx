import { Dialog, DialogContent, DialogTrigger } from "../components/floating/Dialog";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import TextInput from "../components/input/TextInput";
import useForm from "../hooks/useForm";
import { UserContext, UserContextType } from "../data/UserContext";
import loader_icon from "../assets/icons/loader-icon.svg";

type SignupProps = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    switchToLogIn: () => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const SignUp = ({open, setOpen, switchToLogIn, ...props}: SignupProps) => {

    const {login, allUsers, addUser, userFetchPending, userFetchError, userWritePending, userWriteError, addedUID}
         = useContext(UserContext) as UserContextType;

    const fields = ["username", "email", "password"] as const;
    const initialValues = Object.fromEntries(fields.map(k => [k, ""])) as {[k in typeof fields[number]]: string}
    const validators = {
        username: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Korisničko ime ne sme sadržati razmak", (val: string) => !val.includes(' ')]
        ],
        email: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Mora biti validan email", (val: string) => val.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]
        ],
        password: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Lozinka mora sadržati bar 8 karaktera", (val: string) => val.length >= 8]
        ]
    } as {[k in typeof fields[number]]: [string, (val:string)=>boolean][]}

    const {fieldValues, errors, setFieldValue, setError, validate, clearForm, clearErrors} 
        = useForm(fields, initialValues, validators);

    const closeDialog = () => {
        clearForm();
        setOpen(false);
    }

    const [formSubmitted, setformSubmitted] = useState(false);
    const [signupFinished, setSignupFinished] = useState(false);

    const signup = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validate()){
            setformSubmitted(true);
        }

    }, [fieldValues]);

    useEffect(() => { // run signup when users are loaded and form has been submitted
        const doSignup = async () => {
            if(!userFetchPending && formSubmitted){
                let userFound = false;
                for(let id in allUsers){
                    if(allUsers[id].korisnickoIme.trim() === fieldValues["username"]){
                        userFound = true;
                        break;
                    }
                }
                if(userFound){
                    clearErrors();
                    setError("username", "Zauzeto korisničko ime");
                    setformSubmitted(false);
                } else {
                    addUser({
                        korisnickoIme: fieldValues["username"],
                        email: fieldValues["email"],
                        lozinka: fieldValues["password"],
                        ime: "",
                        prezime: "",
                        adresa: "",
                        datumRodjenja: "",
                        telefon: ""
                    });
                    setSignupFinished(true);
                }
            }
        }
        doSignup();
    }, [userFetchPending, formSubmitted]);

    useEffect(() => { // after adding user, close dialog and log in
        if(!userWritePending && formSubmitted && signupFinished){
            closeDialog();
            if(!userWriteError && addedUID)
                login(addedUID);
            setformSubmitted(false);
        }
    }, [userWritePending, formSubmitted, signupFinished]);


    return ( 
        <Dialog open={open} onOpenChange={closeDialog}>
            <DialogTrigger onClick={() => setOpen(!open)} {...props}>Registracija</DialogTrigger>

            <DialogContent className="bg-white p-4 rounded-lg flex items-center flex-col">
                <h2 className="text-xl fancy-underline">Registracija</h2>
                <form className="m-2" onSubmit={signup} noValidate>
                    <TextInput
                        value={fieldValues["username"]}
                        setValue={(val:string) => setFieldValue("username", val)}
                        label="Korisnicko ime"
                        error={errors["username"]}
                        required
                    />
                    <TextInput
                        value={fieldValues["email"]}
                        setValue={(val:string) => setFieldValue("email", val)}
                        type="email"
                        label="Email adresa"
                        error={errors["email"]}
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
                        <button type="button" onClick={() => {closeDialog(); switchToLogIn();}} className="text-secondary-400 hover:text-primary-500 font-semibold">
                            Prijava
                        </button>
                        <button type="submit" className={"btn-primary text-lg" + (formSubmitted? 'bg-primary-500 h-12 w-32 p-0' : '')} 
                            disabled={formSubmitted || userFetchPending}>
                            {formSubmitted ? (
                                <img src={loader_icon} alt="Processing..." className="h-full m-auto" />
                            ) : "Registracija"}
                        </button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}
 
export default SignUp;