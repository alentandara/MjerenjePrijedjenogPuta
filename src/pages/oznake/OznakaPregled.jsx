import { useEffect, useState } from "react"
import OznakaService from "../../services/oznake/OznakaService";
import { Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function OznakaPregled() {

    const navigate = useNavigate()
    const [oznake, setOznake] = useState([])

     async function ucitajOznake() {
        await OznakaService.get().then((odgovor) => {
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setOznake(odgovor.data)

        })
    }

    useEffect(() => {
        ucitajOznake();
    }, [])

   

    async function obrisi(sifra) {
        if(!confirm('Sigurno obrisati')){
            return
        }
        await OznakaService.obrisi(sifra)
        ucitajOznake()
    }

    return (
        <>
         <Link to={RouteNames.OZNAKE_NOVI} 
            className="btn btn-success w-100 mb-3 mt-3">
                Dodavanje nove oznake
            </Link>
            <Table>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {oznake && oznake.map((oznaka) => (
                        <tr key={oznaka.sifra}>
                            <td>{oznaka.naziv}</td>
                            <td>
                                <Button onClick={()=>{navigate(`/oznake/${oznaka.sifra}`)}}>
                                    Promjeni
                                </Button>
                                &nbsp;&nbsp;
                                 <Button variant="danger" onClick={()=>{obrisi(oznaka.sifra)}}>
                                    Obriši
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>


    )
}