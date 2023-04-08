import { Destinacija } from "./Destinacija";

export interface Agencija {
    naziv: string;
    logo: string;
    godina: string;
    adresa: string;
    email: string;
    brojTelefona: string;
    destinacije: string;
}

export interface AgencijaHomepage{
    id: string;
    naziv: string;
    logo: string;
    destinacijeID: string;
    destinacijeList: [string, Destinacija][];
    destinacijeErr: string|null;
    destinacijePending: boolean
}