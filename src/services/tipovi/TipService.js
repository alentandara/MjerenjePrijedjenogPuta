import { tipovi } from "./TipPodaci";

// 1/4 Read od CRUD
async function get() {
    return {data: tipovi}
}

async function getBySifra(sifra) {
    return {data: tipovi.find(s => s.sifra === parseInt(sifra))}
}

// 2/4 Create od CRUD
async function dodaj(tip){
    if(tipovi.length>0){
        tip.sifra = tipovi[tipovi.length - 1].sifra + 1
    }else{
        tip.sifra = 1
    }
    
    tipovi.push(tip);
}

async function promjeni(sifra,tip) {
    const index = nadiIndex(sifra)
    tipovi[index] = {...tipovi[index], ...tip}
}

function nadiIndex(sifra){
    return tipovi.findIndex(s=>s.sifra === parseInt(sifra))
}


export default{
    get,
    dodaj,
    getBySifra,
    promjeni
}