import { useEffect, useState } from "react";
import PutService from "../../services/putevi/PutService";
import { Button, Table, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";



export default function PutPregled() {

    const navigate = useNavigate();
     const [putevi, setPutovi] = useState([]);
     
   

    async function ucitajPutove() {
        await PutService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis');
                return;
            }
            setPutovi(odgovor.data);
        });
    }

    useEffect(() => {
        ucitajPutove();
    }, []);

    async function obrisi(sifra) {
        if (!confirm('Sigurno obrisati')) {
            return;
        }
        await PutService.obrisi(sifra);
        ucitajPutove();
    }

    function trajanje(startTime, endTime) {
        return startTime && endTime
            ? ((endTime - startTime) / 1000).toFixed(1)
            : 0;
    }

    return (
        <>
            <Link
                to={RouteNames.PUTEVI_NOVI}
                className="btn btn-success w-100 mb-3 mt-3"
            >
                Dodavanje novog puta
            </Link>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Tip</th>
                        <th>Trajanje</th>
                        <th>Dužina</th>
                        <th>Opis</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {putevi && putevi.map((put) => (
                        <tr key={put.sifra}>
                            <td>{put.naziv}</td>
                            <td>{put.tip}</td>
                            <td>
                                {trajanje(
                                    new Date(put.pocetak),
                                    new Date(put.kraj)
                                )} s
                            </td>
                            <td>{(put.duzinaPuta / 1000).toFixed(2)} km</td>
                            <td>{put.opis ? put.opis : "-"}</td>

                            <td>
                                <div className="d-flex gap-2">

                                    <Button
                                        variant="primary"
                                        onClick={() => navigate(`/putevi/${put.sifra}`)}
                                    >
                                        Promjeni
                                    </Button>

                                    <Button
                                        variant="danger"
                                        onClick={() => obrisi(put.sifra)}
                                    >
                                        Obriši
                                    </Button>

                                    <Button
                                        onClick={() => navigate(`/putevi/karta/${put.sifra}`)}
                                    >
                                        Karta
                                    </Button>

                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

           
        </>
    );
}

