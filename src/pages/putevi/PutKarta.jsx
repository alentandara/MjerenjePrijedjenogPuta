import { GoogleMap, Polyline, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState, useCallback, useRef } from "react";
import PutService from "../../services/putevi/PutService";
import { Link, useParams } from "react-router-dom";
import { Button, Col, Row, Badge } from "react-bootstrap";
import { RouteNames } from "../../constants";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PutKarta() {
  const [put, setPut] = useState({});
  const params = useParams();
  const mapRef = useRef(null);

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

  // Automatski fokus na sve točke
  const handleOnLoad = useCallback(
    (map) => {
      if (path.length === 0) return;

      const bounds = new window.google.maps.LatLngBounds();

      path.forEach((p) => bounds.extend(p));

      map.fitBounds(bounds);
    },
    [path]
  );

  function getUkupnoVrijeme(put) {
    if (!put.pocetak || !put.kraj) return "";

    const diff = new Date(put.kraj) - new Date(put.pocetak);

    const sec = Math.floor(diff / 1000) % 60;
    const min = Math.floor(diff / (1000 * 60)) % 60;
    const hr = Math.floor(diff / (1000 * 60 * 60));

    return `${hr}h ${min}m ${sec}s`;
  }

  const fetchFontAsBase64 = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Font nije pronađen: ${url}`);
    }

    const blob = await response.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onloadend = () => resolve(reader.result.split(",")[1]);

      reader.readAsDataURL(blob);
    });
  };

  // PDF GENERATOR
  async function generirajPDF(put) {
    const doc = new jsPDF();

    const [regBase64, boldBase64] = await Promise.all([
      fetchFontAsBase64("/fonts/Roboto-Regular.ttf"),
      fetchFontAsBase64("/fonts/Roboto-Bold.ttf")
    ]);

    doc.addFileToVFS("Roboto-Regular.ttf", regBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");

    doc.addFileToVFS("Roboto-Bold.ttf", boldBase64);
    doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

    let y = 10;

    doc.setFontSize(16);
    doc.setFont("Roboto", "normal");
    doc.text("Izvještaj o prijeđenom putu", 10, y);

    y += 10;
    doc.setFontSize(12);

    doc.text(`Naziv: ${put.naziv}`, 10, y);
    y += 8;

    doc.text(`Tip: ${put.tip}`, 10, y);
    y += 8;

    doc.text(`Početak: ${formatDatum(put.pocetak)}`, 10, y);
    y += 8;

    doc.text(`Kraj: ${formatDatum(put.kraj)}`, 10, y);
    y += 8;

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

    if (put.oznake && put.oznake.length > 0) {
      const oznakeText = put.oznake.map((o) => o.naziv).join(", ");

      doc.text(`Oznake: ${oznakeText}`, 10, y);
    } else {
      doc.text(`Oznake: -`, 10, y);
    }

    const element = mapRef.current;

    if (!element) {
      alert("Mapa još nije učitana.");
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2,
        logging: false
      });

      const imgData = canvas.toDataURL("image/png");

      const imgProps = doc.getImageProperties(imgData);

      const pdfWidth = doc.internal.pageSize.getWidth();

      const pdfHeight =
        (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, "PNG", 0, 90, pdfWidth, pdfHeight);

      doc.save(`${put.naziv}.pdf`);
    } catch (error) {
      alert(error.message);
    }
  }

  function formatDatum(datum) {
    if (!datum) return "-";

    return new Date(datum).toLocaleString();
  }

  function trajanje(startTime, endTime) {
    return startTime && endTime
      ? ((endTime - startTime) / 1000).toFixed(1)
      : 0;
  }

  return (
    <>

    <Row style={{marginTop: '1rem'}}>
      <Col md={6} xs={6} sm={6}>
      <Link
            to={RouteNames.PUTEVI}
            className="btn btn-danger"
          >
            Odustani
          </Link>
      </Col>
      <Col md={6} xs={6} sm={6} style={{textAlign: 'right'}}>
      <Button
            variant="secondary"
            onClick={() => generirajPDF(put)}
          >
            PDF
          </Button>
      </Col>
    </Row>
    

      <div className="mb-3">
        <span
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            marginRight: "10px"
          }}
        >
          Početak:
        </span>

        <Badge bg="primary" pill style={{ fontSize: "16px" }}>
          {put.pocetak
            ? new Date(put.pocetak).toLocaleString()
            : "-"}
        </Badge>
      </div>

      <div className="mb-3">
        <span
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            marginRight: "10px"
          }}
        >
          Kraj:
        </span>

        <Badge bg="primary" pill style={{ fontSize: "16px" }}>
          {put.kraj
            ? new Date(put.kraj).toLocaleString()
            : "-"}
        </Badge>
      </div>

      <div className="mb-3">
        <span
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            marginRight: "10px"
          }}
        >
          Ukupno vrijeme:
        </span>

        <Badge bg="primary" pill style={{ fontSize: "16px" }}>
          {getUkupnoVrijeme(put)}
        </Badge>
      </div>

      <div className="mb-4">
        <span
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            marginRight: "10px"
          }}
        >
          Udaljenost:
        </span>

        <Badge bg="primary" pill style={{ fontSize: "16px" }}>
          {put.duzinaPuta
            ? `${(put.duzinaPuta / 1000).toFixed(2)} km`
            : "0 km"}
        </Badge>
      </div>

      {/* PDF desno, Odustani lijevo */}
      <Row className="mb-4 mt-4">
        <Col className="d-flex justify-content-between">
          

          
        </Col>
      </Row>

      {isLoaded && (
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "400px",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        >
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "400px"
            }}
            onLoad={handleOnLoad}
          >
            {path.length > 0 && (
              <Polyline
                path={path}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 1,
                  strokeWeight: 4
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
        </div>
      )}
    </>
  );
}