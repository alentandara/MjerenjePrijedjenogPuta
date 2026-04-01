const STORAGE_KEY = 'putevi';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const putevi = dohvatiSveIzStorage();
    return {success: true,  data: [...putevi] };
}

async function getBySifra(sifra) {
    const putevi = dohvatiSveIzStorage();
    const put = putevi.find(s => s.sifra === parseInt(sifra));
    return {success: true,  data: put };
}

async function dodaj(put) {
    const putevi = dohvatiSveIzStorage();
    
    if (putevi.length === 0) {
        put.sifra = 1;
    } else {
        const maxSifra = Math.max(...putevi.map(s => s.sifra));
        put.sifra = maxSifra + 1;
    }
    
    putevi.push(put);
    spremiUStorage(putevi);
    return { data: put };
}

async function promjeni(sifra, put) {
    const putevi = dohvatiSveIzStorage();
    const index = putevi.findIndex(s => s.sifra === parseInt(sifra));
    
    if (index !== -1) {
        putevi[index] = { ...putevi[index], ...put};
        spremiUStorage(putevi);
    }
    return { data: putevi[index] };
}

async function obrisi(sifra) {
    let putevi = dohvatiSveIzStorage();
    putevi = putevi.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(putevi);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};
