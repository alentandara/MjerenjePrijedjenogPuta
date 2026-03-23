import { useEffect, useState } from "react"
import TipService from "../../services/tipovi/TipService";
import { Table } from "react-bootstrap";

export default function TipPregled() {

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
                        <tr>
                            <td>{tip.naziv}</td>
                            <td>{tip.opis}</td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>


    )
}
