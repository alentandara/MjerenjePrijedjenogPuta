import { oznake } from "./OznakaPodaci";

// 1/4 Read od CRUD
async function get() {
    return {success:true,data: [...oznake]}
}

async function getBySifra(sifra) {
    return {success:true,data: oznake.find(s => s.sifra === parseInt(sifra))}
}

// 2/4 Create od CRUD
async function dodaj(oznaka){
    if(oznake.length>0){
        oznaka.sifra = oznake[oznake.length - 1].sifra + 1
    }else{
        oznaka.sifra = 1
    }
    
    oznake.push(oznaka);
}

async function promjeni(sifra,oznaka) {
    const index = nadiIndex(sifra)
    oznake[index] = {...oznake[index], ...oznaka}
}

function nadiIndex(sifra){
    return oznake.findIndex(s=>s.sifra === parseInt(sifra))
}

async function obrisi(sifra) {
    const index = nadiIndex(sifra)
    oznake.splice(index,1)
}

export default{
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
}