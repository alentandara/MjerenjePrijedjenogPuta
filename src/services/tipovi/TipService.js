import TipServiceLocalStorage from "./TipServiceLocalStorage";
import TipServiceMemorija from "./TipServiceMemorija";
import { DATA_SOURCE } from "../../constants";

let Servis = null;


switch (DATA_SOURCE) {
    case 'memorija':
        Servis = TipServiceMemorija;
        break;
    case 'localStorage':
        Servis = TipServiceLocalStorage;
        break;
    default:
        Servis = null;
}


const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (smjer) => { console.error("Servis nije učitan"); },
    promjeni: async (sifra, smjer) => { console.error("Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("Servis nije učitan"); }
};

// 3. Jedan jedini export na kraju
// Ako Servis postoji, koristi njega, inače koristi PrazanServis
const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (tip) => AktivniServis.dodaj(tip),
    promjeni: (sifra, tip) => AktivniServis.promjeni(sifra, tip),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
};