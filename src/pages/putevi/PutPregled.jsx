import { useEffect, useState } from "react";
import PutService from "../../services/putevi/PutService";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useBreakpoint from "../../hooks/useBreakpoint";
import jsPDF from "jspdf";
import "../../assets/fonts/roboto"
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

    function formatDatum(datum) {
        if (!datum) return "-";
        return new Date(datum).toLocaleString();
    }

    // 🧾 PDF GENERATOR
    function generirajPDF(put) {
        const doc = new jsPDF();

        let y = 10;

        doc.setFontSize(16);
        doc.text("Izvještaj o prijeđenom putu", 10, y);

        y += 10;
        doc.setFontSize(12);

        doc.text(`Naziv: ${put.naziv}`, 10, y); y += 8;
        doc.text(`Tip: ${put.tip}`, 10, y); y += 8;

        doc.text(`Početak: ${formatDatum(put.pocetak)}`, 10, y); y += 8;
        doc.text(`Kraj: ${formatDatum(put.kraj)}`, 10, y); y += 8;

        doc.text(
            `Trajanje: ${trajanje(
                new Date(put.pocetak),
                new Date(put.kraj)
            )} s`,
            10,
            y
        );
        y += 8;

        doc.text(
            `Dužina: ${(put.duzinaPuta / 1000).toFixed(2)} km`,
            10,
            y
        );
        y += 8;

        doc.text(`Opis: ${put.opis ? put.opis : "-"}`, 10, y);
        y += 8;

        // ako imaš oznake kao niz
        if (put.oznake && put.oznake.length > 0) {
            const oznakeText = put.oznake.map(o => o.naziv).join(", ");
            doc.text(`Oznake: ${oznakeText}`, 10, y);
        } else {
            doc.text(`Oznake: -`, 10, y);
        }

        doc.save(`${put.naziv}.pdf`);
    }

    return (
        <>
            <Link
                to={RouteNames.PUTEVI_NOVI}
                className="btn btn-success w-100 mb-3 mt-3"
            >
                Dodavanje novog puta
            </Link>

            {/* 📱 MOBITEL */}
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
                                <Button size="sm" onClick={() => navigate(`/putevi/${put.sifra}`)}>
                                    Promjeni
                                </Button>

                                <Button size="sm" variant="danger" onClick={() => obrisi(put.sifra)}>
                                    Obriši
                                </Button>

                                <Button size="sm" onClick={() => navigate(`/putevi/karta/${put.sifra}`)}>
                                    Karta
                                </Button>

                                <Button size="sm" variant="secondary" onClick={() => generirajPDF(put)}>
                                    PDF
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 💻 DESKTOP */}
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
                                        <Button size="sm" onClick={() => navigate(`/putevi/${put.sifra}`)}>
                                            Promjeni
                                        </Button>

                                        <Button size="sm" variant="danger" onClick={() => obrisi(put.sifra)}>
                                            Obriši
                                        </Button>

                                        <Button size="sm" onClick={() => navigate(`/putevi/karta/${put.sifra}`)}>
                                            Karta
                                        </Button>

                                        <Button size="sm" variant="secondary" onClick={() => generirajPDF(put)}>
                                            PDF
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