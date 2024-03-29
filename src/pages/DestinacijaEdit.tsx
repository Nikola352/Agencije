import { useParams } from "react-router-dom";
import { Destinacija } from "../data/Destinacija";
import useDBFetch from "../hooks/useDBFetch";
import useForm from "../hooks/useForm";
import useDBUpdate from "../hooks/useDBUpdate";
import TextInput from "../components/input/TextInput";
import { useEffect, useState } from "react";
import Dropdown from "../components/floating/Dropdown";
import MultiImageInput from "../components/input/MultiImageInput";
import { Dialog, DialogContent } from "../components/floating/Dialog";

const DestinacijaEdit = () => {
    const { id1, id2 } = useParams();
    const { data: destinacija, error: fetchError, isPending: fetchPending } 
        = useDBFetch<Destinacija>(`destinacije/${id1}/${id2}`);

    const fields = ["naziv", "cena", "maxOsoba", "prevoz", "tip", "opis", "slike"]
    const initialValues = {
        naziv: destinacija?.naziv ?? "",
        cena: destinacija?.cena.toString() ?? "",
        maxOsoba: destinacija?.maxOsoba.toString() ?? "",
        prevoz: destinacija?.prevoz ?? "autobus",
        tip: destinacija?.tip ?? "Letovanje",
        opis: destinacija?.opis ?? "",
        slike: destinacija?.slike.join(', ') ?? ""
    }

    const validators = {
        naziv: [
            ["Obavezno polje", (val: string) => val !== ""],
        ], 
        cena: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Cena mora biti broj", (val: string) => !isNaN(Number(val))],
            ["Cena mora biti pozitivan broj", (val: string) => Number(val) > 0]
        ],
        maxOsoba: [
            ["Obavezno polje", (val: string) => val !== ""],
            ["Broj osoba mora biti broj", (val: string) => !isNaN(Number(val))],
            ["Broj osoba mora biti pozitivan broj", (val: string) => Number(val) > 0]
        ],
        prevoz: [
            ["Obavezno polje", (val: string) => val !== ""],
        ],
        tip: [
            ["Obavezno polje", (val: string) => val !== ""],
        ],
        opis: [
            ["Obavezno polje", (val: string) => val !== ""],
        ],
        slike: [
            ["Obavezno polje", (val: string) => val !== ""],
        ]
    } as {[k in typeof fields[number]]: [string, (val:string)=>boolean][]};

    const {fieldValues, errors, setFieldValue, setError, validate, clearForm, clearErrors, setFieldValues}
        = useForm(fields, initialValues, validators);

    useEffect(() => {
        if(destinacija){
            setFieldValues({
                naziv: destinacija.naziv,
                cena: destinacija.cena.toString(),
                maxOsoba: destinacija.maxOsoba.toString(),
                prevoz: destinacija.prevoz,
                tip: destinacija.tip,
                opis: destinacija.opis,
                slike: destinacija.slike.join(', ')
            })
        }
    }, [destinacija])

    const {update, error: updateError, isPending: updatePending} = useDBUpdate<Destinacija>(`destinacije/${id1}/${id2}`);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validate()){
            setAwaitingResponse(true);
            update({
                naziv: fieldValues.naziv,
                cena: Number(fieldValues.cena),
                maxOsoba: Number(fieldValues.maxOsoba),
                prevoz: fieldValues.prevoz as "autobus" | "avion" | "sopstveni",
                tip: fieldValues.tip as "Letovanje" | "Zimovanje" | "Gradovi Evrope",
                opis: fieldValues.opis,
                slike: fieldValues.slike.split(',').map(s => s.trim())
            })
        }
    }

    const [dialogOpen, setDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [awaitingResponse, setAwaitingResponse] = useState(false);

    useEffect(() => {
        if(updateError){
            setErrorDialogOpen(true);
        }
    }, [updateError]);

    useEffect(() => {
        if(!updatePending && !errorDialogOpen && awaitingResponse){
            setDialogOpen(true);
            setAwaitingResponse(false);
        }
    }, [updatePending, awaitingResponse, errorDialogOpen]);

    return ( 
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 fancy-underline">Izmena destinacije</h2>
            <form onSubmit={handleSubmit} noValidate className="w-full">
                <div className="w-full flex flex-col md:flex-row justify-around items-start">
                    <div className="flex flex-col gap-4 items-center w-full flex-grow-0">
                        <TextInput
                            name="naziv"
                            value={fieldValues.naziv}
                            setValue={(val: string) => setFieldValue("naziv", val)}
                            error={errors.naziv}
                            label="Naziv"
                        />
                        <TextInput
                            name="cena"
                            value={fieldValues.cena}
                            setValue={(val: string) => setFieldValue("cena", val)}
                            error={errors.cena}
                            label="Cena"
                            type="number"
                        />
                        <TextInput
                            name="maxOsoba"
                            value={fieldValues.maxOsoba}
                            setValue={(val: string) => setFieldValue("maxOsoba", val)}
                            error={errors.maxOsoba}
                            label="Maksimalan broj osoba"
                            type="number"
                        />
                        <fieldset className="flex flex-col md:flex-row gap-2">
                            <Dropdown
                                name="prevoz"
                                value={fieldValues.prevoz}
                                setValue={(val: string) => setFieldValue("prevoz", val)}
                                options={["autobus", "avion", "sopstveni"]}
                                required
                            />
                            <Dropdown
                                name="tip"
                                value={fieldValues.tip}
                                setValue={(val: string) => setFieldValue("tip", val)}
                                options={["Letovanje", "Zimovanje", "Gradovi Evrope"]}
                                required
                            />
                        </fieldset>
                        <TextInput
                            name="opis"
                            value={fieldValues.opis}
                            setValue={(val: string) => setFieldValue("opis", val)}
                            error={errors.opis}
                            label="Opis"
                            type="textarea"
                        />
                    </div>

                    <MultiImageInput urls={fieldValues.slike} setUrls={(val: string) => setFieldValue("slike", val)} />
                </div>
                
                <button type="submit" disabled={updatePending} className="btn-primary w-1/2 mt-6">Sačuvaj</button>
            </form>

            {destinacija && !updatePending && updateError && (
                <Dialog open={errorDialogOpen} onOpenChange={() => setErrorDialogOpen(!errorDialogOpen)}>
                    <DialogContent className="bg-white rounded-lg p-4 text-center">
                        <p className="text-xl mb-4">Došlo je do greške pri izmeni podataka</p>
                        <button
                            onClick={() => setErrorDialogOpen(false)}
                            className="btn-primary font-semibold m-2 w-1/3"
                        >OK</button>
                    </DialogContent>
                </Dialog>
            )}
            
            {destinacija && !updatePending && !updateError && (
                <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(!dialogOpen)}>
                    <DialogContent className="bg-white rounded-lg p-4 text-center">
                        <p className="text-xl mb-4">Uspešna izmena podataka desstinacije</p>
                        <button
                            onClick={() => setDialogOpen(false)}
                            className="btn-primary font-semibold m-2 w-1/3"
                        >OK</button>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
 
export default DestinacijaEdit;