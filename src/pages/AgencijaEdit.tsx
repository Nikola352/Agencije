import useForm from "../hooks/useForm";
import TextInput from "../components/input/TextInput";
import { Link, useParams } from "react-router-dom";
import useDBFetch from "../hooks/useDBFetch";
import { Agencija } from "../data/Agencija";
import { useEffect, useState } from "react";
import useDBUpdate from "../hooks/useDBUpdate";
import { Destinacija } from "../data/Destinacija";
import useDBRemoveFrom from "../hooks/useDBRemoveFrom";
import { Dialog, DialogContent } from "../components/floating/Dialog";

import delete_icon from "../assets/icons/delete-icon-white.svg";
import delete_icon_active from "../assets/icons/delete-icon-error.svg";
import edit_icon from "../assets/icons/edit-icon-white.svg";
import edit_icon_active from "../assets/icons/edit-icon-accent.svg";

const AgencijaEdit = () => {
    const { id } = useParams();
    const { data: agencija, error: fetchError, isPending: fetchPending } = useDBFetch<Agencija>(`agencije/${id}`);
    const { data: destinacije, error: destError, isPending: destPending }
        = useDBFetch<{[key:string]: Destinacija}>('destinacije/' + agencija?.destinacije, [agencija?.destinacije]);

    const fields = ["naziv", "godina", "adresa", "email", "brojTelefona"] as const;
    const initialValues = {
        naziv: agencija?.naziv || "",
        godina: agencija?.godina || "",
        adresa: agencija?.adresa || "",
        email: agencija?.email || "",
        brojTelefona: agencija?.brojTelefona || ""
    }

    const validators = {
        naziv: [
            ["Obavezno polje", (val: string) => val !== ""],
        ],
        godina: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Mora biti validna godina", (val: string) => val.match(/^[0-9]{4}$/)],
            ["Mora biti u opsegu 1900 - " + (new Date()).getFullYear(), (val: string) => parseInt(val) >= 1900 && parseInt(val) <= (new Date()).getFullYear()]
        ],
        adresa: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Mora biti validna adresa", (val: string) => val.match(/^[a-zA-Z0-9\s]+(?:\s[a-zA-Z0-9]+)?,\s[a-zA-Z0-9\s]+,\s*.*\d.*$/)]
        ],
        email: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Mora biti validan email", (val: string) => val.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]
        ],
        brojTelefona: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Mora biti validan broj telefona", (val: string) => val.match(/\d{3}\/\d{4}[-]?\d{6}/)]  
        ]
    } as {[k in typeof fields[number]]: [string, (val:string)=>boolean][]};

    const {fieldValues, errors, setFieldValue, setError, validate, clearForm, clearErrors, setFieldValues}
        = useForm(fields, initialValues, validators);

    useEffect(() => {
        if (agencija) {
            setFieldValues({
                naziv: agencija.naziv,
                godina: agencija.godina,
                adresa: agencija.adresa,
                email: agencija.email,
                brojTelefona: agencija.brojTelefona
            })
        }
    }, [agencija, fetchError, fetchPending]);

    const [logo, setLogo] = useState<string | undefined>(agencija?.logo);
    const [logoSrc, setLogoSrc] = useState<string | undefined>(agencija?.logo);
    useEffect(() => {
        if (agencija) {
            setLogo(agencija.logo);
            setLogoSrc(agencija.logo);
        }
    }, [agencija, fetchError, fetchPending]);

    const {update, error: updateError, isPending: updatePending} = useDBUpdate<Agencija>("agencije/" + id);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validate()) {
            update({
                naziv: fieldValues["naziv"],
                godina: fieldValues["godina"],
                adresa: fieldValues["adresa"],
                email: fieldValues["email"],
                brojTelefona: fieldValues["brojTelefona"],
                logo: logo? logo : "",
                destinacije: agencija?.destinacije || ""
            });
        }
    }

    const logoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLogoSrc(logo);
        update({
            naziv: fieldValues["naziv"],
            godina: fieldValues["godina"],
            adresa: fieldValues["adresa"],
            email: fieldValues["email"],
            brojTelefona: fieldValues["brojTelefona"],
            logo: logo? logo : "",
            destinacije: agencija?.destinacije || ""
        });
    }

    const {remove: removeDest, error: removeDestErr, isPending: removeDestPending} = useDBRemoveFrom(`destinacije/${agencija?.destinacije}`);
    const [deleteDestDialogOpen, setDeleteDestDialogOpen] = useState(false);
    const [deleteDestKey, setDeleteDestKey] = useState("");

    const [isPresentDestinacija, setIsPresentDestinacija] = useState<{[key:string]: boolean}>({});
    useEffect(() => {
        if(destinacije) {
            setIsPresentDestinacija((prev) => {
                let newPresent = {...prev};
                Object.keys(destinacije).forEach((key) => {
                    newPresent[key] = true;
                });
                return newPresent;
            })
        }
    }, [destinacije]);

    const removeDestinacija = () => {
        if(deleteDestKey === "") return;
        removeDest(deleteDestKey);
        setDeleteDestDialogOpen(false);
        setIsPresentDestinacija((prev) => {
            let newPresent = {...prev};
            newPresent[deleteDestKey] = false;
            return newPresent;
        });
    }

    return ( 
        <div id="agencija-edit" className="w-11/12 mx-auto">
            <div className="my-4 text-center">
                <h1 className="text-2xl font-bold mb-6 fancy-underline">Izmena agencije</h1>
            </div>
                
            <div className="flex justify-around flex-wrap">
                <form id="osnovni-podaci" onSubmit={handleSubmit} noValidate className="relative h-full overflow-hidden rounded-lg shadow-sm shadow-black inline-block w-auto m-4 ml-0">

                    <h2 className="m-4 mb-2 text-xl fancy-underline">Osnovni podaci</h2>

                    <TextInput
                        value={fieldValues["naziv"]}
                        setValue={(val: string) => setFieldValue("naziv", val)}
                        error={errors["naziv"]}
                        label="Naziv"
                    />

                    <TextInput
                        value={fieldValues["godina"]}
                        setValue={(val: string) => setFieldValue("godina", val)}
                        error={errors["godina"]}
                        label="Godina osnivanja"
                        type="number"
                        min={1900}
                        max={new Date().getFullYear()}
                    />

                    <TextInput
                        value={fieldValues["adresa"]}
                        setValue={(val: string) => setFieldValue("adresa", val)}
                        error={errors["adresa"]}
                        label="Adresa"
                    />

                    <TextInput
                        value={fieldValues["email"]}
                        setValue={(val: string) => setFieldValue("email", val)}
                        error={errors["email"]}
                        label="Email"
                        type="email"
                    />

                    <TextInput
                        value={fieldValues["brojTelefona"]}
                        setValue={(val: string) => setFieldValue("brojTelefona", val)}
                        error={errors["brojTelefona"]}
                        label="Broj telefona"
                        type="tel"
                    />

                    <div className="controls flex justify-around items-center mb-4">
                        <input type="reset" value="Resetuj" className="btn text-secondary-600" onClick={clearForm} />
                        <input type="submit" value="Sačuvaj" className="btn-primary" disabled={fetchPending || updatePending} />
                    </div>

                </form>

                <form id="logo" onSubmit={logoSubmit} className="relative h-full overflow-hidden rounded-lg shadow-sm shadow-black w-96 lg:w-[34rem] inline-flex flex-col items-center m-4">
                    <img src={logoSrc} alt="Odabrani url ne pokazuje na sliku." className="w-full object-cover" />
                    <TextInput
                        value={logo? logo : ""}
                        setValue={(val: string) => setLogo(val)}
                        label="url slike"
                        type="url"
                    />
                    <input 
                        type="submit" value="Sačuvaj" 
                        className="btn-primary w-1/3 mb-4" 
                        disabled={fetchPending || updatePending}
                    />
                </form>

                <div id="destinacija" className="relative h-full overflow-hidden rounded-lg shadow-sm shadow-black inline-block p-4 text-xl m-4 w-full">
                    <h2 className="mb-2 text-xl fancy-underline">Destinacije</h2>
                    {destError && <p>Došlo je do greške pri učitavanju destinacija.</p>}
                    {destPending && <p>Učitavanje destinacija...</p>}
                    <button className="btn mb-4 ml-6 text-sm text-secondary-600 hover:text-white">
                        <Link to={`/destinacija/${agencija?.destinacije}/new`}>Dodaj destinaciju</Link>
                    </button>
                    <ul className="overflow-auto h-96 w-full">
                        {
                            destinacije && Object.entries(destinacije).map(([key, dest]) => 
                                isPresentDestinacija[key] && (
                                <li key={key} className="flex justify-end items-center bg-primary-300 my-2 rounded-lg text-white px-2 w-full">
                                    <Link to={`/destinacija/${agencija!.destinacije}/${key}`} className="clickable-shadow font-semibold mr-auto">
                                        {dest.naziv}
                                    </Link>
                                    <Link to={`/destinacija/${agencija!.destinacije}/${key}/edit`}>
                                        <button>
                                            <img src={edit_icon} alt="obriši"
                                                className="w-10 h-10"
                                                onMouseOver={e => e.currentTarget.src = edit_icon_active}
                                                onMouseOut={e => e.currentTarget.src = edit_icon}
                                            />
                                        </button>
                                    </Link>
                                    <button className="" onClick={() => {
                                        setDeleteDestKey(key);
                                        setDeleteDestDialogOpen(true);
                                    }}>
                                        <img src={delete_icon} alt="obriši" 
                                            className="w-10 h-10"
                                            onMouseOver={e => e.currentTarget.src = delete_icon_active}
                                            onMouseOut={e => e.currentTarget.src = delete_icon} 
                                        />
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
            
            <Dialog open={deleteDestDialogOpen} onOpenChange={() => setDeleteDestDialogOpen(!deleteDestDialogOpen)}>
                    <DialogContent className="bg-white rounded-lg p-4 text-center">
                        {destinacije && deleteDestKey && isPresentDestinacija && (
                            <p className="text-xl mb-4">Da li ste sigurni da želite da uklonite {destinacije[deleteDestKey].naziv} iz liste destinacija?</p>
                        )}
                        <button
                            onClick={() => setDeleteDestDialogOpen(false)}
                            className="btn text-secondary-600 hover:text-white font-semibold m-2 w-1/3"
                        >Odustani</button>
                        <button 
                            onClick={() => removeDestinacija()}
                            className="btn-error m-2 w-1/3"
                        >Obriši</button>
                    </DialogContent>
            </Dialog>

        </div>
    );
}
 
export default AgencijaEdit;