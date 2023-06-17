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

    const fields = ["username", "email", "password", "name", "lastname", "address", "birthDate", "phone"] as const;
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
        ],
        name: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Ime ne sme sadržati razmak", (val: string) => !val.includes(' ')]
        ],
        lastname: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Prezime ne sme sadržati razmak", (val: string) => !val.includes(' ')]
        ],
        address: [
            ["Obavezno polje", (val: string) => val !== ""]
        ],
        birthDate: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Datum rođenja ne sme biti u budućnosti", (val: string) => new Date(val) <= new Date()]
        ],
        phone: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Mora biti validan broj telefona", (val: string) => val.match(/\d{3}(\/\d{4}[-]?\d{6}|\d{6})/)]
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
                        ime: fieldValues["name"],
                        prezime: fieldValues["lastname"],
                        adresa: fieldValues["address"],
                        datumRodjenja: fieldValues["birthDate"],
                        telefon: fieldValues["phone"]
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
                    <div className="flex justify-start flex-col sm:justify-around sm:flex-row">
                        <div className="left">
                            <TextInput
                                value={fieldValues["username"]}
                                setValue={val => setFieldValue("username", val)}
                                error={errors["username"]}
                                label="Korisničko ime"
                                />

                            <TextInput
                                value={fieldValues["email"]}
                                setValue={val => setFieldValue("email", val)}
                                error={errors["email"]}
                                label="Email"
                                type="email"
                                />

                            <TextInput
                                value={fieldValues["password"]}
                                setValue={val => setFieldValue("password", val)}
                                error={errors["password"]}
                                label="Lozinka"
                                type="password"
                                />
                            
                            <TextInput
                                value={fieldValues["birthDate"]}
                                setValue={val => setFieldValue("birthDate", val)}
                                error={errors["birthDate"]}
                                label="Datum rođenja"
                                type="date"
                                />
                        </div>

                        <div className="right">
                            <TextInput
                                value={fieldValues["name"]}
                                setValue={val => setFieldValue("name", val)}
                                error={errors["name"]}
                                label="Ime"
                                />

                            <TextInput
                                value={fieldValues["lastname"]}
                                setValue={val => setFieldValue("lastname", val)}
                                error={errors["lastname"]}
                                label="Prezime"
                                />

                            <TextInput
                                value={fieldValues["address"]}
                                setValue={val => setFieldValue("address", val)}
                                error={errors["address"]}
                                label="Adresa"
                                />


                            <TextInput
                                value={fieldValues["phone"]}
                                setValue={val => setFieldValue("phone", val)}
                                error={errors["phone"]}
                                label="Telefon"
                                />
                        </div>
                    </div>

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