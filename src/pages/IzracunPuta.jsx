import { useState, useRef } from "react";

export default function IzracunPuta() {


    const [travelType, setTravelType] = useState("");
    const [distance, setDistance] = useState(0);
    const [isTracking, setIsTracking] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

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

        });
    }

    function stopTracking() {

        navigator.geolocation.clearWatch(watchId.current);
        setEndTime(new Date());
        setIsTracking(false);
    }

    const duration =
        startTime && endTime
            ? ((endTime - startTime) / 1000).toFixed(1)
            : 0;


    return (
        <>
            <div style={{ padding: "30px" }}>

                <h2>Praćenje putovanja</h2>

                {!isTracking && !endTime && (
                    <>
                        <label>Unesi tip putovanja:</label>

                        <select
                            value={travelType}
                            onChange={(e) => setTravelType(e.target.value)}
                        >
                            <option value="">Odaberi</option>
                            <option value="hodanje">Hodanje</option>
                            <option value="bicikl">Bicikl</option>
                            <option value="automobil">Automobil</option>
                            <option value="zrakoplov">Zrakoplov</option>
                        </select>

                        <br /><br />

                        <button
                            onClick={startTracking}
                            disabled={!travelType}
                        >
                            Start
                        </button>
                    </>
                )}

                {isTracking && (
                    <>
                        <h3>Praćenje u tijeku...</h3>
                        <p>Udaljenost: {(distance / 1000).toFixed(3)} km</p>

                        <button onClick={stopTracking}>
                            Stop
                        </button>
                    </>
                )}

                {endTime && (
                    <>
                        <h3>Rezultat putovanja</h3>

                        <p>Način putovanja: {travelType}</p>
                        <p>Prijeđeni put: {(distance / 1000).toFixed(3)} km</p>
                        <p>Trajanje: {duration} sekundi</p>

                        <p>Datum: {endTime.toLocaleDateString()}</p>
                        <p>Vrijeme: {endTime.toLocaleTimeString()}</p>
                    </>
                )}

            </div>
        </>
    )
}