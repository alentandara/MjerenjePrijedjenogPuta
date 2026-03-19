import { useEffect, useState } from "react"
import TipService from "../../services/tipovi/TipService";

export default function TipPregled(){

    const [tipovi, setTipovi] = useState([])

    useEffect(()=>{
        ucitajTipove();
    },[])

    async function ucitajTipove() {
        await TipService.get().then((odgovor)=>{
            setTipovi(odgovor.data)
        })
    }

    return(

     
    )
}
