import { GoogleMap, Polyline, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState, useCallback } from "react";
import PutService from "../../services/putevi/PutService";
import { Link, useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { RouteNames } from "../../constants";

export default function PutKarta() {
  const [put, setPut] = useState({});
  const params = useParams();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA6HNLT0VV3ou7XPQPxKa4kiUfOB2cyhFE"
  });

  useEffect(() => {
    ucitajPut();
  }, []);

  async function ucitajPut() {
    const odgovor = await PutService.getBySifra(params.sifra);
    if (!odgovor.success) {
      alert("Nije implementiran servis");
      return;
    }
    setPut(odgovor.data);
  }

  const path =
    put?.pozicije?.map((p) => ({
      lat: p.latitude,
      lng: p.longitude
    })) || [];

  // Kad se mapa prvi put učita – automatski postavi prikaz na sve točke
  const handleOnLoad = useCallback((map) => {
    if (path.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    path.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds);
  }, [path]);

  function getUkupnoVrijeme(put) {
    if (!put.pocetak || !put.kraj) return "";
    const diff = new Date(put.kraj) - new Date(put.pocetak);
    const sec = Math.floor(diff / 1000) % 60;
    const min = Math.floor(diff / (1000 * 60)) % 60;
    const hr = Math.floor(diff / (1000 * 60 * 60));
    return `${hr}h ${min}m ${sec}s`;
  }

  return (
    <>
      <p><b>Početak:</b> {new Date(put.pocetak).toLocaleString()}</p>
      <p><b>Kraj:</b> {new Date(put.kraj).toLocaleString()}</p>
      <p><b>Ukupno vrijeme:</b> {getUkupnoVrijeme(put)}</p>
      <p><b>Udaljenost:</b> {(put.duzinaPuta / 1000).toFixed(2)} km</p>

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          onLoad={handleOnLoad}
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
          {path.length > 0 && <Marker position={path[0]} />}
          {path.length > 1 && <Marker position={path[path.length - 1]} />}
        </GoogleMap>
      )}

      <hr style={{ marginTop: "50px", border: "0" }} />

      <Row>
        <Col>
          <Link to={RouteNames.PUTEVI} className="btn btn-danger">
            Odustani
          </Link>
        </Col>
      </Row>
    </>
  );
}
