import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../components/floating/Dialog";
import edit_icon from "../assets/icons/edit-icon-white.svg";
import edit_icon_active from "../assets/icons/edit-icon-accent.svg";
import TextInput from "../components/input/TextInput";
import useDBFetch from "../hooks/useDBFetch";
import { User } from "../data/User";
import useForm from "../hooks/useForm";
import useDBUpdate from "../hooks/useDBUpdate";

const UserEdit = ({id}: {id: string}) => {
    const [open, setOpen] = useState(false);

    const {data: user, error, isPending} = useDBFetch<User>('korisnici/' + id);

    const fields = ["korisnickoIme", "email", "lozinka", "ime", "prezime", "adresa", "datumRodjenja", "telefon"] as const;
    const initialValues = {
        korisnickoIme: user?.korisnickoIme || "",
        email: user?.email || "",
        lozinka: user?.lozinka || "",
        ime: user?.ime || "",
        prezime: user?.prezime || "",
        adresa: user?.adresa || "",
        datumRodjenja: user?.datumRodjenja || "",
        telefon: user?.telefon || "",
    };
    const validators = {
        korisnickoIme: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Korisničko ime ne sme sadržati razmak", (val: string) => !val.includes(' ')]
        ],
        email: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Mora biti validan email", (val: string) => val.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]
        ],
        lozinka: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Lozinka mora sadržati bar 8 karaktera", (val: string) => val.length >= 8]
        ],
        ime: [
            ["Obavezno polje", (val: string) => val !== ""]
        ],
        prezime: [
            ["Obavezno polje", (val: string) => val !== ""]
        ],
        adresa: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Mora biti validna adresa", (val: string) => val.match(/^[a-zA-Z0-9\s]+(?:\s[a-zA-Z0-9]+)?,\s[a-zA-Z0-9\s]+,\s*.*\d.*$/)]
        ],
        datumRodjenja: [
            ["Obavezno polje", (val: string) => val !== ""],
            // TODO: format datuma
            // TODO: Datum ne sme biti u budućnosti
        ],
        telefon: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Mora biti validan broj telefona", (val: string) => val.match(/\d{3}(\/\d{4}[-]?\d{6}|\d{6})/)]  
        ]
    } as {[k in typeof fields[number]]: [string, (val:string)=>boolean][]};

    const {fieldValues, errors, setFieldValue, setError, validate, clearForm, clearErrors, setFieldValues}
        = useForm(fields, initialValues, validators);

    useEffect(() => {
        if(user){
            setFieldValues({
                korisnickoIme: user.korisnickoIme,
                email: user.email,
                lozinka: user.lozinka,
                ime: user.ime,
                prezime: user.prezime,
                adresa: user.adresa,
                datumRodjenja: user.datumRodjenja,
                telefon: user.telefon
            })
        }
    }, [user, error, isPending]);

    const {update, error: updateErr, isPending: updatePending} = useDBUpdate<User>('korisnici/' + id);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validate()){
            update({
                korisnickoIme: fieldValues["korisnickoIme"],
                email: fieldValues["email"],
                lozinka: fieldValues["lozinka"],
                ime: fieldValues["ime"],
                prezime: fieldValues["prezime"],
                adresa: fieldValues["adresa"],
                datumRodjenja: fieldValues["datumRodjenja"],
                telefon: fieldValues["telefon"]
            });
            setOpen(false);
        }
    }

    return ( 
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogTrigger onClick={() => setOpen(!open)}>
                <img src={edit_icon} alt="izmeni"
                    className="w-10 h-10"
                    onMouseOver={e => e.currentTarget.src = edit_icon_active}
                    onMouseOut={e => e.currentTarget.src = edit_icon}
                />
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4">
                    <h1 className="text-2xl font-semibold mb-4 fancy-underline mx-auto">Izmena korisnika</h1>

                    <div className="flex justify-around">
                        <div className="left">
                            <TextInput
                                value={fieldValues["korisnickoIme"]}
                                setValue={val => setFieldValue("korisnickoIme", val)}
                                error={errors["korisnickoIme"]}
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
                                value={fieldValues["lozinka"]}
                                setValue={val => setFieldValue("lozinka", val)}
                                error={errors["lozinka"]}
                                label="Lozinka"
                                type="password"
                                />
                            
                            <TextInput
                                value={fieldValues["datumRodjenja"]}
                                setValue={val => setFieldValue("datumRodjenja", val)}
                                error={errors["datumRodjenja"]}
                                label="Datum rođenja"
                                type="date"
                                />
                        </div>

                        <div className="right">
                            <TextInput
                                value={fieldValues["ime"]}
                                setValue={val => setFieldValue("ime", val)}
                                error={errors["ime"]}
                                label="Ime"
                                />

                            <TextInput
                                value={fieldValues["prezime"]}
                                setValue={val => setFieldValue("prezime", val)}
                                error={errors["prezime"]}
                                label="Prezime"
                                />

                            <TextInput
                                value={fieldValues["adresa"]}
                                setValue={val => setFieldValue("adresa", val)}
                                error={errors["adresa"]}
                                label="Adresa"
                                />


                            <TextInput
                                value={fieldValues["telefon"]}
                                setValue={val => setFieldValue("telefon", val)}
                                error={errors["telefon"]}
                                label="Telefon"
                                />
                        </div>
                    </div>

                    <div className="flex justify-around items-center mt-4">
                        <input type="reset" value="Resetuj" className="btn text-secondary-600 hover:text-white"/>
                        <input type="submit" value="Sačuvaj" className="btn-primary" />
                    </div>

                </form>


            </DialogContent>
        </Dialog>
    );
}
 
export default UserEdit;