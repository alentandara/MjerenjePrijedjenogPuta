import { useState } from "react";
import { Button, Container, Form, Alert, Table } from "react-bootstrap";

import PutService from "../services/putevi/PutService";
import TipService from "../services/tipovi/TipService";
import OznakaService from "../services/oznake/OznakaService";

export default function GeneriranjePodataka() {

    const [broj, setBroj] = useState(3);
    const [loading, setLoading] = useState(false);
    const [poruka, setPoruka] = useState(null);
    const [preview, setPreview] = useState([]);

    const tipovi = ["Pješačenje", "Bicikl", "Trčanje", "Auto"];
    const oznake = ["Start", "Kraj", "Uspon", "Spust", "Raskrižje"];

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // =========================
    // PUTOVI (ostaje isto)
    // =========================

    function generateRoutePoints(startLat, startLng, segments = 5) {
        const points = [];
        let lat = startLat;
        let lng = startLng;

        for (let i = 0; i < segments; i++) {
            lat += random(-0.002, 0.002);
            lng += random(-0.002, 0.002);

            points.push({ lat, lng });
        }

        return points;
    }

    function izracunajDuzinuTocaka(points) {
        let total = 0;

        for (let i = 1; i < points.length; i++) {
            const R = 6371e3;

            const lat1 = points[i - 1].lat * Math.PI / 180;
            const lat2 = points[i].lat * Math.PI / 180;

            const dLat = (points[i].lat - points[i - 1].lat) * Math.PI / 180;
            const dLng = (points[i].lng - points[i - 1].lng) * Math.PI / 180;

            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(lat1) *
                Math.cos(lat2) *
                Math.sin(dLng / 2) ** 2;

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            total += R * c;
        }

        return total;
    }

    const generirajPuteve = async () => {
        for (let i = 0; i < broj; i++) {

            const startLat = 45.80 + Math.random() * 0.2;
            const startLng = 15.97 + Math.random() * 0.2;

            const points = generateRoutePoints(startLat, startLng, 6);

            const duzina = izracunajDuzinuTocaka(points);

            const start = new Date();
            const kraj = new Date(start.getTime() + Math.random() * 7200000);

            const put = {
                naziv: `Put ${i + 1}`,
                tip: tipovi[Math.floor(Math.random() * tipovi.length)],
                pocetak: start.toISOString(),
                kraj: kraj.toISOString(),
                duzinaPuta: duzina,
                tocke: points
            };

            await PutService.dodaj(put);
        }
    };

    // =========================
    // TIPOVI (NOVO)
    // =========================

    const generirajTipove = async () => {
        for (let i = 0; i < broj; i++) {
            await TipService.dodaj({
                naziv: `Tip ${i + 1}`,
                opis: "Automatski generiran tip"
            });
        }
    };

    // =========================
    // OZNAKE (NOVO)
    // =========================

    const generirajOznake = async () => {
        for (let i = 0; i < broj; i++) {
            await OznakaService.dodaj({
                naziv: oznake[Math.floor(Math.random() * oznake.length)],
                opis: "Automatski generirana oznaka"
            });
        }
    };

    // =========================
    // MAIN GENERATOR
    // =========================

    const generirajSve = async () => {
        setLoading(true);
        setPoruka(null);

        try {
            await generirajPuteve();
            await generirajTipove();
            await generirajOznake();

            setPoruka({
                tip: "success",
                tekst: `Generirano: ${broj} puteva, tipova i oznaka!`
            });

        } catch (err) {
            setPoruka({
                tip: "danger",
                tekst: "Greška: " + err.message
            });
        }

        setLoading(false);
    };

    return (
        <Container className="mt-4">

            <h2>Generiranje podataka</h2>

            {poruka && (
                <Alert variant={poruka.tip}>
                    {poruka.tekst}
                </Alert>
            )}

            <Form className="mb-3">
                <Form.Group>
                    <Form.Label>Broj entiteta</Form.Label>
                    <Form.Control
                        type="number"
                        value={broj}
                        min={1}
                        max={50}
                        onChange={(e) => setBroj(Number(e.target.value))}
                    />
                </Form.Group>

                <div className="d-flex gap-2 mt-3">
                    <Button onClick={generirajSve}>
                        Generiraj sve (putevi + tipovi + oznake)
                    </Button>
                </div>
            </Form>

        </Container>
    );
}