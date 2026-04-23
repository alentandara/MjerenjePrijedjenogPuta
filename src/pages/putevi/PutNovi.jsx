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
        googleMapsApiKey: "YOUR_KEY"
    });

    async function dodaj(put) {
        await PutService.dodaj(put).then(() => {
            navigate(RouteNames.PUTEVI)
        })
    }

    async function ucitajTipove() {
        const odgovor = await TipService.get();
        if (odgovor.success) {
            setTipovi(odgovor.data)
        }
    }

    useEffect(() => {
        ucitajTipove();
    }, [])

    // HAVERSINE
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // 🔥 GENERIRAJ RANDOM PUT
    function generirajPut() {

        if (tipovi.length === 0) {
            alert("Nema tipova!");
            return;
        }

        const randomTip = tipovi[Math.floor(Math.random() * tipovi.length)];

        const startLat = 45.815 + (Math.random() - 0.5) * 0.02;
        const startLng = 15.981 + (Math.random() - 0.5) * 0.02;

        let lat = startLat;
        let lng = startLng;

        let ukupna = 0;
        const novePozicije = [];

        for (let i = 0; i < 20; i++) {
            const newLat = lat + (Math.random() - 0.5) * 0.001;
            const newLng = lng + (Math.random() - 0.5) * 0.001;

            ukupna += calculateDistance(lat, lng, newLat, newLng);

            novePozicije.push({
                latitude: newLat,
                longitude: newLng
            });

            lat = newLat;
            lng = newLng;
        }

        const start = new Date();
        const end = new Date(start.getTime() + Math.random() * 3600000);

        dodaj({
            naziv: "Auto generirani put",
            tip: randomTip.sifra,
            duzinaPuta: ukupna.toFixed(3),
            pocetak: start,
            kraj: end.toISOString(),
            pozicije: novePozicije
        });
    }

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

            <Button variant="warning" onClick={generirajPut}>
                ⚡ Generiraj random put
            </Button>

            <hr />

            <Form>
                <Form.Group controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control
                        type="text"
                        value={naziv}
                        onChange={(e) => setNaziv(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="tip">
                    <Form.Label>Tip</Form.Label>
                    <Form.Select
                        value={travelType}
                        onChange={(e) => setTravelType(e.target.value)}
                    >
                        <option value={0}>Odaberite tip</option>
                        {tipovi.map((tip) => (
                            <option key={tip.sifra} value={tip.sifra}>
                                {tip.naziv}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Form>
        </>
    )
}