import { tipovi } from "./TipPodaci";

// 1/4 Read od CRUD
async function get() {
    return {data: tipovi}
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


export default{
    get,
    dodaj
}