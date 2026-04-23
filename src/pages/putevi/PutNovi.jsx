import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import PutService from "../../services/putevi/PutService";
import { useEffect, useRef, useState } from "react";
import TipService from "../../services/tipovi/TipService";

import { GoogleMap, Polyline, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function PutNovi() {

    const navigate = useNavigate()

    const [naziv, setNaziv] = useState("");
    const [travelType, setTravelType] = useState(0);
    const [distance, setDistance] = useState(0);
    const [isTracking, setIsTracking] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [pozicije, setPozicije] = useState([]);
    const [tipovi, setTipovi] = useState([]);
    const [showMapModal, setShowMapModal] = useState(false);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyA6HNLT0VV3ou7XPQPxKa4kiUfOB2cyhFE"
    });

    async function dodaj(put) {
        await PutService.dodaj(put).then(() => {
            navigate(RouteNames.PUTEVI)
        })
    }

    async function ucitajTipove() {
        await TipService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }
            setTipovi(odgovor.data)
        })
    }

    useEffect(() => {
        ucitajTipove();
    }, [])

    const lastPosition = useRef(null);
    const watchId = useRef(null);

    // ✅ HAVERSINE FORMULA
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3;

        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    function startTracking() {

        if (!naziv.trim() || !travelType) {
            alert("Morate unijeti naziv i odabrati tip!");
            return;
        }

        setDistance(0);
        setStartTime(new Date());
        setEndTime(null);
        setIsTracking(true);
        setPozicije([]);

        lastPosition.current = null;

        watchId.current = navigator.geolocation.watchPosition(
            (pos) => {

                const { latitude, longitude } = pos.coords;

                if (lastPosition.current) {
                    const d = calculateDistance(
                        lastPosition.current.latitude,
                        lastPosition.current.longitude,
                        latitude,
                        longitude
                    );

                    setDistance(prev => prev + d);
                }

                lastPosition.current = { latitude, longitude };

                setPozicije(p => [...p, { latitude, longitude }])
            },
            (err) => {
                console.error(err);
                alert("Greška GPS-a: " + err.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }

    function stopTracking() {

        navigator.geolocation.clearWatch(watchId.current);
        setIsTracking(false);

        const krajVrijeme = new Date();
        setEndTime(krajVrijeme);

        dodaj({
            naziv: naziv,
            tip: travelType,
            duzinaPuta: distance.toFixed(3),
            pocetak: startTime,
            kraj: krajVrijeme.toISOString(),
            pozicije: pozicije
        })
    }

    function getUkupnoVrijeme() {
        if (!startTime || !endTime) return "";

        const diff = new Date(endTime) - new Date(startTime);

        const sec = Math.floor(diff / 1000) % 60;
        const min = Math.floor(diff / (1000 * 60)) % 60;
        const hr = Math.floor(diff / (1000 * 60 * 60));

        return `${hr}h ${min}m ${sec}s`;
    }

    const path = pozicije.map(p => ({
        lat: p.latitude,
        lng: p.longitude
    }));

    const center = path.length > 0
        ? path[path.length - 1]
        : { lat: 45.815, lng: 15.981 };

    return (
        <>
            <Row className="mb-3">
                <Col>
                    <h3>Unos novog Puta</h3>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="secondary"
                        onClick={() => navigate(RouteNames.PUTEVI)}
                    >
                        Odustani
                    </Button>
                </Col>
            </Row>

            <Form>
                <Form.Group controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control
                        type="text"
                        value={naziv}
                        onChange={(e) => setNaziv(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="tip">
                    <Form.Label>Tip</Form.Label>

                    <Form.Select
                        value={travelType}
                        onChange={(e) => setTravelType(e.target.value)}
                    >
                        <option value={0}>Odaberite tip</option>
                        {tipovi && tipovi.map((tip) => (
                            <option key={tip.sifra} value={tip.sifra}>
                                {tip.naziv}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <hr style={{ marginTop: '30px' }} />

                <Row>
                    <Col>

                        {!isTracking && (
                            <Button
                                onClick={startTracking}
                                disabled={!travelType || naziv.trim() === ""}
                            >
                                Start
                            </Button>
                        )}

                        {isTracking && (
                            <>
                                <Button onClick={stopTracking}>
                                    Stop
                                </Button>

                                <Button
                                    variant="info"
                                    className="ms-2"
                                    onClick={() => setShowMapModal(true)}
                                    disabled={pozicije.length === 0}
                                >
                                    Karta
                                </Button>

                                <h4 className="mt-3">Praćenje u tijeku...</h4>
                                <p>Udaljenost: {(distance / 1000).toFixed(3)} km</p>
                                <p>Točke: {pozicije.length}</p>

                                {isLoaded && (
                                    <GoogleMap
                                        mapContainerStyle={{ width: "100%", height: "300px" }}
                                        center={center}
                                        zoom={15}
                                    >
                                        {path.length > 0 && (
                                            <Polyline
                                                path={path}
                                                options={{
                                                    strokeColor: "#FF0000",
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

                    </Col>
                </Row>
            </Form>

            {/* MODAL */}
            <Modal show={showMapModal} onHide={() => setShowMapModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Prikaz puta</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p><b>Početak:</b> {startTime && new Date(startTime).toLocaleString()}</p>
                    <p><b>Kraj:</b> {endTime && new Date(endTime).toLocaleString()}</p>
                    <p><b>Ukupno vrijeme:</b> {getUkupnoVrijeme()}</p>
                    <p><b>Udaljenost:</b> {(distance / 1000).toFixed(3)} km</p>

                    {isLoaded && (
                        <GoogleMap
                            mapContainerStyle={{ width: "100%", height: "300px" }}
                            center={center}
                            zoom={15}
                        >
                            {path.length > 0 && (
                                <Polyline path={path} />
                            )}
                        </GoogleMap>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMapModal(false)}>
                        Zatvori
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}