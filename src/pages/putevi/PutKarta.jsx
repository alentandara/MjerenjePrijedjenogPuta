import { GoogleMap, Polyline, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState, useCallback } from "react";
import PutService from "../../services/putevi/PutService";
import { Link, useParams } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import { RouteNames } from "../../constants";
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import { useRef } from "react";

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




  const fetchFontAsBase64 = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Font nije pronađen: ${url}`);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(blob);
    });
  };




  // 🧾 PDF GENERATOR
  async function generirajPDF(put) {
    const doc = new jsPDF();

    const [regBase64, boldBase64] = await Promise.all([
      fetchFontAsBase64('/fonts/Roboto-Regular.ttf'),
      fetchFontAsBase64('/fonts/Roboto-Bold.ttf')
    ]);

    doc.addFileToVFS('Roboto-Regular.ttf', regBase64);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');

    doc.addFileToVFS('Roboto-Bold.ttf', boldBase64);
    doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

    let y = 10;

    doc.setFontSize(16);
    doc.setFont('Roboto', 'normal');
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


    const element = mapRef.current; // TVOJA KARTA

    if (!element) {
      alert("Mapa još nije učitana.");
      return;
    }


    // html2canvas pravi screenshot tog elementa
    const canvas = await html2canvas(element, {
      useCORS: true, // Ključno za Google Maps slike!
      scale: 2,      // Povećava kvalitetu slike (retina display efekt)
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');

    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    doc.save(`${put.naziv}.pdf`);
  }


  return (
    <>
      <Button size="sm" variant="secondary" onClick={() => generirajPDF(put)}>
        PDF
      </Button>
      <p>
        <b style={{ fontSize: "22px" }}>Početak:</b>{" "}
        <span style={{ fontSize: "22px" }}>
          {new Date(put.pocetak).toLocaleString()}
        </span>
      </p>

      <p>
        <b style={{ fontSize: "22px" }}>Kraj:</b>{" "}
        <span style={{ fontSize: "22px" }}>
          {new Date(put.kraj).toLocaleString()}
        </span>
      </p>

      <p>
        <b style={{ fontSize: "22px" }}>Ukupno vrijeme:</b>{" "}
        <span style={{ fontSize: "22px" }}>
          {getUkupnoVrijeme(put)}
        </span>
      </p>

      <p>
        <b style={{ fontSize: "22px" }}>Udaljenost:</b>{" "}
        <span style={{ fontSize: "22px" }}>
          {(put.duzinaPuta / 1000).toFixed(2)} km
        </span>
      </p>

      {isLoaded && (
        <GoogleMap ref={mapRef}
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
