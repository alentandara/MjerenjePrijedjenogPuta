import { useEffect, useState } from "react";
import PutService from "../../services/putevi/PutService";
import { Button, Table, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

import { GoogleMap, Polyline, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function PutPregled() {

    const navigate = useNavigate();
    const [putevi, setPutovi] = useState([]);

    const [showMap, setShowMap] = useState(false);
    const [selectedPut, setSelectedPut] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyA6HNLT0VV3ou7XPQPxKa4kiUfOB2cyhFE"
    });

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

    function getUkupnoVrijeme(put) {
        if (!put.pocetak || !put.kraj) return "";

        const diff = new Date(put.kraj) - new Date(put.pocetak);

        const sec = Math.floor(diff / 1000) % 60;
        const min = Math.floor(diff / (1000 * 60)) % 60;
        const hr = Math.floor(diff / (1000 * 60 * 60));

        return `${hr}h ${min}m ${sec}s`;
    }

    const path = selectedPut?.pozicije?.map(p => ({
        lat: p.latitude,
        lng: p.longitude
    })) || [];

    const center = path.length > 0
        ? path[path.length - 1]
        : { lat: 45.815, lng: 15.981 };

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
                                        variant="info"
                                        onClick={() => {
                                            setSelectedPut(put);
                                            setShowMap(true);
                                        }}
                                        disabled={!put.pozicije || put.pozicije.length === 0}
                                    >
                                        Karta
                                    </Button>

                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal
                show={showMap}
                onHide={() => setShowMap(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Prikaz puta</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    {selectedPut && (
                        <>
                            <p><b>Početak:</b> {new Date(selectedPut.pocetak).toLocaleString()}</p>
                            <p><b>Kraj:</b> {new Date(selectedPut.kraj).toLocaleString()}</p>
                            <p><b>Ukupno vrijeme:</b> {getUkupnoVrijeme(selectedPut)}</p>
                            <p><b>Udaljenost:</b> {(selectedPut.duzinaPuta / 1000).toFixed(2)} km</p>

                            {isLoaded && (
                                <GoogleMap
                                    mapContainerStyle={{ width: "100%", height: "400px" }}
                                    center={center}
                                    zoom={15}
                                >
                                    {path.length > 0 && (
                                        <Polyline
                                            path={path}
                                            options={{
                                                strokeColor: "#FF0000",
                                                strokeOpacity: 1,
                                                strokeWeight: 3
                                            }}
                                        />
                                    )}

                                    {path.length > 0 && (
                                        <Marker position={path[0]} />
                                    )}

                                    {path.length > 1 && (
                                        <Marker position={path[path.length - 1]} />
                                    )}
                                </GoogleMap>
                            )}
                        </>
                    )}

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMap(false)}>
                        Zatvori
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

