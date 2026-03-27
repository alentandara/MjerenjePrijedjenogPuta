import { useEffect, useState } from "react"
import TipService from "../../services/tipovi/TipService";
import { Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function TipPregled() {

    const navigate = useNavigate()
    const [tipovi, setTipovi] = useState([])

    useEffect(() => {
        ucitajTipove();
    }, [])

    async function ucitajTipove() {
        await TipService.get().then((odgovor) => {
            setTipovi(odgovor.data)
        })
    }

    return (
        <>
         <Link to={RouteNames.TIPOVI_NOVI} 
            className="btn btn-success w-100 mb-3 mt-3">
                Dodavanje novog tipa
            </Link>
            <Table>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Opis</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {tipovi && tipovi.map((tip) => (
                        <tr key={tip.sifra}>
                            <td>{tip.naziv}</td>
                            <td>{tip.opis}</td>
                            <td>
                                <Button onClick={()=>{navigate(`/tipovi/${tip.sifra}`)}}>
                                    Promjeni
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>


    )
}