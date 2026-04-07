import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import PutService from "../../services/putevi/PutService";
import { useEffect, useRef, useState } from "react";
import TipService from "../../services/tipovi/TipService";

export default function PutNovi() {

    const navigate = useNavigate()

    const [travelType, setTravelType] = useState(1);
    const [distance, setDistance] = useState(0);
    const [isTracking, setIsTracking] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [pozicije, setPozicije] = useState([])
    const [tipovi, setTipovi] = useState([])


    async function dodaj(put) {
        await PutService.dodaj(put).then(() => {
            navigate(RouteNames.PUTEVI)
        })
    }

    async function ucitajTipove() {
            await TipService.get().then((odgovor) => {
                if(!odgovor.success){
                    alert('Nije implementiran servis')
                    return
                }
                setTipovi(odgovor.data)
                console.table(odgovor.data)
            })
        }

        useEffect(() => {
                ucitajTipove();
            }, [])
        



    // izračun


    const lastPosition = useRef(null);
    const watchId = useRef(null);

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

        // kontrola da ne može početi sve dok nije unio naziv i tip

        setDistance(0);
        setStartTime(new Date());
        setIsTracking(true);

        watchId.current = navigator.geolocation.watchPosition((pos) => {

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

            setPozicije(p => [...p,{ latitude, longitude }])
           // console.log(pozicije)
        });
    }

    function stopTracking() {

        navigator.geolocation.clearWatch(watchId.current);
        setIsTracking(false);

        dodaj({
            naziv: document.getElementById('naziv').value,
            tip: travelType,
            duzinaPuta: distance.toFixed(3),
            pocetak: startTime,
            kraj: new Date().toISOString(),
            pozicije: pozicije
        })
    }




    // završio izračun



    return (
        <>
            <h3>
                Unos novog Puta
            </h3>
            <Form>
                <Form.Group controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv" required />
                </Form.Group>

                <Form.Group controlId="tip">
                    <Form.Label>Tip</Form.Label>
                    
                    <Form.Select name="tip" onChange={(e)=>setTravelType(e.target.value)}>
                        <option key={0} value={0}>Odaberite tip</option>
                        {tipovi && tipovi.map((tip) => (
                        <option key={tip.sifra} value={tip.sifra}>{tip.naziv}</option>
                    ))}
                    </Form.Select>
                </Form.Group>


                <hr style={{ marginTop: '50px', border: '0' }} />

                <Row>
                   
                    <Col>
                        {!isTracking && (
                            <>
                               

                                <Button
                                    onClick={startTracking}
                                    disabled={!travelType}
                                >
                                    Start
                                </Button>
                            </>
                        )}

                        {isTracking && (
                            <>
                                <h3>Praćenje u tijeku...</h3>
                                <p>Udaljenost: {(distance / 1000).toFixed(3)} km</p>

                                <Button onClick={stopTracking}>
                                    Stop
                                </Button>
                            </>
                        )}
                    </Col>
                </Row>

            </Form>
        </>
    )
}