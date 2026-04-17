import { GoogleMap, Polyline, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import PutService from "../../services/putevi/PutService";
import { Link, useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { RouteNames } from "../../constants";

export default function PutKarta() {

    const [put, setPut] = useState({})
    const params = useParams()
    const [showMap, setShowMap] = useState(false);
    const [selectedPut, setSelectedPut] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyA6HNLT0VV3ou7XPQPxKa4kiUfOB2cyhFE"
    });

    useEffect(() => {
        ucitajPut()
    }, [])

    async function ucitajPut() {
        await PutService.getBySifra(params.sifra).then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }
            const s = odgovor.data
            setPut(s)
        })
    }


    function getUkupnoVrijeme(put) {
        if (!put.pocetak || !put.kraj) return "";

        const diff = new Date(put.kraj) - new Date(put.pocetak);

        const sec = Math.floor(diff / 1000) % 60;
        const min = Math.floor(diff / (1000 * 60)) % 60;
        const hr = Math.floor(diff / (1000 * 60 * 60));

        return `${hr}h ${min}m ${sec}s`;
    }

    const path = put?.pozicije?.map(p => ({
        lat: p.latitude,
        lng: p.longitude
    })) || [];

    const center = path.length > 0
        ? path[path.length - 1]
        : { lat: 45.815, lng: 15.981 };

    function izracunajZoomIZaslon(lokacije, mapWidth, mapHeight) {
        if (lokacije.length === 0) return 10;
        if (lokacije.length === 1) return 15;

        // 1. Pronađi ekstremne točke (Bounds)
        let minLat = Infinity, maxLat = -Infinity;
        let minLng = Infinity, maxLng = -Infinity;

        lokacije.forEach(l => {
            minLat = Math.min(minLat, l.latitude);
            maxLat = Math.max(maxLat, l.latitude);
            minLng = Math.min(minLng, l.longitude);
            maxLng = Math.max(maxLng, l.longitude);
        });

        // 2. Izračunaj razliku
        const latDiff = maxLat - minLat;
        const lngDiff = maxLng - minLng;

        // 3. Konstante za izračun (bazirano na Mercatorovoj projekciji)
        const WORLD_DIM = { height: 256, width: 256 };
        const ZOOM_MAX = 10;

        function getZoom(diff, mapDim, worldDim) {
            // Formula: Zoom = log2(MapDim * 360 / (Diff * WorldDim))
            return Math.floor(Math.log2((mapDim * 360) / (diff * worldDim)));
        }

        // Izračunaj zoom za širinu i visinu posebno
        const zoomLng = getZoom(lngDiff, mapWidth, WORLD_DIM.width);
        const zoomLat = getZoom(latDiff, mapHeight, WORLD_DIM.height);

        // Uzmi manji zoom (onaj koji više "udaljava" kartu) kako bi sve stalo
        let finalZoom = Math.min(zoomLng, zoomLat);

        // Ograniči zoom unutar dopuštenih granica
        return Math.max(0, Math.min(finalZoom, ZOOM_MAX));
    }


    return (
        <>
            <p><b>Početak:</b> {new Date(put.pocetak).toLocaleString()}</p>
            <p><b>Kraj:</b> {new Date(put.kraj).toLocaleString()}</p>
            <p><b>Ukupno vrijeme:</b> {getUkupnoVrijeme(put)}</p>
            <p><b>Udaljenost:</b> {(put.duzinaPuta / 1000).toFixed(2)} km</p>


            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "400px" }}
                center={center}
                zoom={izracunajZoomIZaslon(put.pozicije,parseInt(window.innerWidth),400)}
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

            <hr style={{ marginTop: '50px', border: '0' }} />

            <Row>
                <Col>
                    <Link to={RouteNames.PUTEVI} className="btn btn-danger">
                        Odustani
                    </Link>
                </Col>
                <Col>

                </Col>
            </Row>
        </>
    );
}

