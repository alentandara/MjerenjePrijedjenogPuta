import { useEffect, useState } from "react"
import SmjerService from "../../services/smjerovi/SmjerService"

export default function SmjerPregled(){


    const [smjerovi, setSmjerovi] = useState([])


    useEffect(()=>{
        ucitajSmjerove()
    },[])

    async function ucitajSmjerove() {
        await SmjerService.get().then((odgovor)=>{
            setSmjerovi(odgovor.data)
        })
    }


    return(
        <>
        <ul>
            {smjerovi && smjerovi.map((smjer)=>(
                <li>{smjer.naziv}</li>
            ))}
        </ul>
        </>
    )
}