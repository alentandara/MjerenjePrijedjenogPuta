import { useEffect, useState } from "react";
import PutService from "../../services/putevi/PutService";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useBreakpoint from "../../hooks/useBreakpoint"; // ⬅️ prilagodi putanju ako treba

export default function PutPregled() {

    const navigate = useNavigate();
    const [putevi, setPutovi] = useState([]);

    const breakpoint = useBreakpoint();
    const isMobile = ['xs', 'sm'].includes(breakpoint);
    const isTablet = breakpoint === 'md';

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

            {/* 📱 MOBITEL → kartice */}
            {isMobile && (
                <div>
                    {putevi.map((put) => (
                        <div
                            key={put.sifra}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '10px',
                                marginBottom: '10px',
                            }}
                        >
                            <p><b>Naziv:</b> {put.naziv}</p>
                            <p><b>Tip:</b> {put.tip}</p>
                            <p><b>Dužina:</b> {(put.duzinaPuta / 1000).toFixed(2)} km</p>
                            <p><b>Trajanje:</b> {trajanje(new Date(put.pocetak), new Date(put.kraj))} s</p>

                            <div className="d-flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => navigate(`/putevi/${put.sifra}`)}
                                >
                                    Promjeni
                                </Button>

                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => obrisi(put.sifra)}
                                >
                                    Obriši
                                </Button>

                                <Button
                                    size="sm"
                                    onClick={() => navigate(`/putevi/karta/${put.sifra}`)}
                                >
                                    Karta
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 💻 TABLET + DESKTOP → tablica */}
            {!isMobile && (
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Naziv</th>
                            <th>Tip</th>
                            <th>Trajanje</th>
                            <th>Dužina</th>
                            {!isTablet && <th>Opis</th>}
                            <th>Akcija</th>
                        </tr>
                    </thead>

                    <tbody>
                        {putevi.map((put) => (
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

                                {!isTablet && (
                                    <td>{put.opis ? put.opis : "-"}</td>
                                )}

                                <td>
                                    <div className="d-flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => navigate(`/putevi/${put.sifra}`)}
                                        >
                                            Promjeni
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => obrisi(put.sifra)}
                                        >
                                            Obriši
                                        </Button>

                                        <Button
                                            size="sm"
                                            onClick={() => navigate(`/putevi/karta/${put.sifra}`)}
                                        >
                                            Karta
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}