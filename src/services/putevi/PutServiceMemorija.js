import { putevi } from "./PutPodaci";

// 1/4 Read od CRUD
async function get() {
    return {success:true,data: [...putevi]}
}

async function getBySifra(sifra) {
    return {success:true,data: putevi.find(s => s.sifra === parseInt(sifra))}
}

// 2/4 Create od CRUD
async function dodaj(put){
    if(putevi.length>0){
        put.sifra = putevi[putevi.length - 1].sifra + 1
    }else{
        put.sifra = 1
    }
    
    putevi.push(put);
}

async function promjeni(sifra,put) {
    const index = nadiIndex(sifra)
    putevi[index] = {...putevi[index], ...put}
}

function nadiIndex(sifra){
    return putevi.findIndex(s=>s.sifra === parseInt(sifra))
}

async function obrisi(sifra) {
    const index = nadiIndex(sifra)
    putevi.splice(index,1)
}

export default{
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
}