export interface Destinacija{
    cena: number;
    maxOsoba: number;
    naziv: string;
    opis: string;
    prevoz: "autobus" | "avion" | "sopstveni";
};