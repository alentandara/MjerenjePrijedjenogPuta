const STORAGE_KEY = 'oznake';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const tipovi = dohvatiSveIzStorage();
    return {success: true,  data: [...tipovi] };
}

async function getBySifra(sifra) {
    const tipovi = dohvatiSveIzStorage();
    const tip = tipovi.find(s => s.sifra === parseInt(sifra));
    return {success: true,  data: tip };
}

async function dodaj(tip) {
    const tipovi = dohvatiSveIzStorage();
    
    if (tipovi.length === 0) {
        tip.sifra = 1;
    } else {
        const maxSifra = Math.max(...tipovi.map(s => s.sifra));
        tip.sifra = maxSifra + 1;
    }
    
    tipovi.push(tip);
    spremiUStorage(tipovi);
    return { data: tip };
}

async function promjeni(sifra, tip) {
    const tipovi = dohvatiSveIzStorage();
    const index = tipovi.findIndex(s => s.sifra === parseInt(sifra));
    
    if (index !== -1) {
        tipovi[index] = { ...tipovi[index], ...tip};
        spremiUStorage(tipovi);
    }
    return { data: tipovi[index] };
}

async function obrisi(sifra) {
    let tipovi = dohvatiSveIzStorage();
    tipovi = tipovi.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(tipovi);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};
