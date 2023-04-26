import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import useDBFetch from "../hooks/useDBFetch";
import Slider from "../components/sliders/Slider";
import { Agencija } from '../data/Agencija';
import { DestinacijaSB } from "../data/Destinacija";
import DestinacijaCard from "../components/cards/DestinacijaCard";
import SearchBar from "../components/input/SearchBar";
import { DestinacijaContext, SearchBarProvider } from "../data/SearchBarContext";
import { SearchBarContextType } from "../data/SearchBarTypes";

import phone_icon from "../assets/icons/phone-icon.svg";
import mail_icon from "../assets/icons/mail-icon.svg";
import location_icon from "../assets/icons/location-icon.svg";
import calendar_icon from "../assets/icons/calendar-icon.svg";
import search_icon_active from "../assets/icons/search-icon-primary.svg";
import search_icon_inactive from "../assets/icons/search-icon-secondary.svg"
import useRenderOnScreenSize from "../hooks/useRenderOnScreenSize";

const TextLoader = () => {
    return (
        <div className="space-y-3 animate-pulse w-3/4 p-2">
            <div className="h-2 bg-secondary-400 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-secondary-400 rounded col-span-2"></div>
                <div className="h-2 bg-secondary-400 rounded col-span-1"></div>
            </div>
        </div>
    )
}

type AgencijaPageChildProps = {
    agencija: Agencija | null;
    isPending: boolean;
    error: string | null;
}

const AgencijaPageChild = ({agencija, isPending, error}: AgencijaPageChildProps) => {
    const {filteredData: destinacije, error: dError, isPending: dIsPending} = useContext(DestinacijaContext) as SearchBarContextType<DestinacijaSB>;

    const [showSearchBar, setShowSearchBar] = useState(false);

    const smScreen = useRenderOnScreenSize(640);

    const basicInfoElStyles = "flex justify-center items-center border-4 border-primary-500 rounded-lg p-1"

    return ( 
        <div id="agencija">
            { error && <h3>Došlo je do greške pri učitavanju podataka.</h3>}
            <article id="agencija-info">
                <h1 className="text-center mb-6">
                    <span className="text-4xl xs:text-5xl font-bold fancy-underline">
                        { !isPending && agencija ? agencija.naziv : "Agencija" }
                    </span>
                </h1>

                <section className="destinacije mt-4 mb-8">
                    <div className="flex items-center justify-between m-2">
                        <h2 className="text-2xl fancy-underline mb-4">Destinacije</h2>

                        {!smScreen && (
                            <button onClick={() => setShowSearchBar(!showSearchBar)} className="w-12 h-12 mt-4 mx-8 border-4 border-secondary-400 hover:border-primary-500 rounded-full">
                                <img src={search_icon_inactive} alt="pretraga"
                                    onMouseOver={(e) => e.currentTarget.src = search_icon_active}
                                    onMouseOut={(e) => e.currentTarget.src = search_icon_inactive}
                                />
                            </button>
                        )}
                    </div>
                    
                    {(showSearchBar || smScreen) && (
                        <SearchBar
                            searchBarType="Destinacija"
                            options={{
                                searchFields: ['naziv'],
                                selectFields: [
                                    ["tip", ["Letovanje", "Zimovanje", "Gradovi Evrope"]],
                                    ["prevoz", ["autobus", "avion", "sopstveni"]]
                                ]
                            }}
                            placeholder="Pretražite destinacije..."
                        ></SearchBar>
                    )}

                    {dError && (
                        <p>Došlo je do greške pri učitavanju destinacija.</p>
                    )}

                    {dIsPending && (
                        <Slider>
                            {Array.from({ length: 10 }, (_, i) => <div key={i} className="w-full h-full card bg-secondary-400 animate-pulse"></div>)}
                        </Slider>
                    )}

                    {agencija && destinacije && destinacije.length>0 ? (
                        <Slider>
                            {destinacije!.map((dest, i) => (
                                <DestinacijaCard dest={dest} gid={agencija.destinacije} key={i} />
                                ))}
                        </Slider>
                    ) : ( !dIsPending ?(
                        <p className="text-center text-xl">Ne postoje destinacije u ponudi...</p>
                    ): "")}
                </section>

                <section id="basic-info" className="grid grid-rows-1 sm:grid-cols-2 gap-4 sm:gap-6 text-lg xs:text-xl font-bold xs:m-2 pt-6">

                    <section className={basicInfoElStyles}>
                        <img src={phone_icon} alt="telefon" className="h-8" />
                        { !isPending && agencija ? (
                            <strong className="font-bold">{agencija.brojTelefona}</strong>
                        ) : (
                            <TextLoader />
                        )}
                    </section>

                    <section className={basicInfoElStyles}>
                        <img src={location_icon} alt="lokacija" className="h-8" />
                        { !isPending && agencija ? (
                            <strong className="font-bold">{agencija.adresa}</strong>
                        ) : (
                            <TextLoader />
                        )}
                    </section>

                    <section className={basicInfoElStyles}>
                        <img src={mail_icon} alt="email" className="h-8" />
                        { !isPending && agencija ? (
                            <strong className="font-bold">{agencija.email}</strong>
                        ) : (
                            <TextLoader />
                        )}
                    </section>

                    <section className={basicInfoElStyles}>
                        <img src={calendar_icon} alt="lokacija" className="h-8" />
                        { !isPending && agencija ? (
                            <span>
                                <span className="font-normal mx-1">osnovano</span>
                                <strong className="font-bold">{ agencija.godina }</strong>
                            </span>
                        ) : (
                            <TextLoader />
                        )}
                    </section>

                </section>


            </article>

        </div>
    );
}

const AgencijaPage = () => {
    const { id } = useParams();
    const { data: agencija, error, isPending } = useDBFetch<Agencija>(`agencije/${id}`);

    return (
        <SearchBarProvider<DestinacijaSB> searchBarType="Destinacija" destID={agencija?.destinacije}>
            <AgencijaPageChild agencija={agencija} isPending={isPending} error={error} />
        </SearchBarProvider>
    )
}
 
export default AgencijaPage;