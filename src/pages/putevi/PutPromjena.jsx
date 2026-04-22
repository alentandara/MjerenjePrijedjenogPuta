import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import TipService from "../../services/tipovi/TipService";
import { useEffect, useState } from "react";
import PutService from "../../services/putevi/PutService";
import OznakaService from "../../services/oznake/OznakaService";

export default function duzinaPuta() {

    const navigate = useNavigate()
    const params = useParams()
    const [tipovi, setTipovi] = useState([])
    const [tip, setTip] = useState(0)
    const [put, setPut] = useState({})
    const [oznake, setOznake] = useState([])
    const [odabraneOznake, setOdabraneOznake] = useState([])
    const [pretragaOznaka, setPretragaOznaka] = useState('')
    const [prikaziAutocomplete, setPrikaziAutocomplete] = useState(false)
    const [odabraniIndex, setOdabraniIndex] = useState(-1)

    useEffect(() => {
        ucitajTipove()
        ucitajOznake()
        ucitajPut()
    }, [])

     useEffect(() => {
        if (put.oznake && oznake.length > 0) {
                const odabrani = oznake.filter(p => put.oznake.includes(p.sifra))
                setOdabraneOznake(odabrani)
            }
    }, [put, oznake])

    async function ucitajOznake() {
        await OznakaService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }
            setOznake(odgovor.data)

        })
    }

    async function ucitajPut() {
        await PutService.getBySifra(params.sifra).then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }
            const s = odgovor.data
            setPut(s)
            setTip(s.tip)
           

        })
    }

    async function ucitajTipove() {
        await TipService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }
            const s = odgovor.data
            setTipovi(s)

        })
    }

    function dodajOznaku(oznaka) {
        if (!odabraneOznake.find(p => p.sifra === oznaka.sifra)) {
            setOdabraneOznake([...odabraneOznake, oznaka])
        }
        setPretragaOznaka('')
        setPrikaziAutocomplete(false)
        setOdabraniIndex(-1)
    }

    function ukloniOznaku(sifra) {
        setOdabraneOznake(odabraneOznake.filter(p => p.sifra !== sifra))
    }

    function filtrirajOznake() {
        if (!pretragaOznaka) return []
        return oznake.filter(p =>
            !odabraneOznake.find(op => op.sifra === p.sifra) &&
            (p.naziv.toLowerCase().includes(pretragaOznaka.toLowerCase()))
        )
    }

    function handleKeyDown(e) {
        const filtriraneOznake = filtrirajOznake()

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOdabraniIndex(prev => {
                if (prev + 1 === filtriraneOznake.length) {
                    return 0
                }
                return prev < filtriraneOznake.length - 1 ? prev + 1 : prev
            }

            )
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setOdabraniIndex(prev => {
                if (prev === 0) {
                    return filtriraneOznake.length - 1
                }
                return prev > 0 ? prev - 1 : 0
            })
        } else if (e.key === 'Enter' && odabraniIndex >= 0 && filtriraneOznake.length > 0) {
            e.preventDefault()
            dodajPolaznika(filtriraneOznake[odabraniIndex])
        } else if (e.key === 'Escape') {
            setPrikaziAutocomplete(false)
            setOdabraniIndex(-1)
        }
    }

    async function promjeni(put) {
        await PutService.promjeni(params.sifra, put).then(() => {
            navigate(RouteNames.PUTEVI)
        })
    }

    function odradiSubmit(e) { //e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        promjeni({
            naziv: podaci.get('naziv'),
            opis: podaci.get('opis'),
            tip: parseInt(podaci.get('tip')),
            oznake: odabraneOznake.map(p => p.sifra)
        })
    }


    return (
        <>
            <h3>
                Promjena Tipa
            </h3>
            <Form onSubmit={odradiSubmit}>
                <Row>
                    <Col md={6}>

                        <Form.Group controlId="naziv">
                            <Form.Label>Naziv</Form.Label>
                            <Form.Control type="text" name="naziv" required
                                defaultValue={put.naziv} />
                        </Form.Group>



                        <Form.Group controlId="tip">
                            <Form.Label>Tip</Form.Label>

                            <Form.Select
                                name="tip"
                                value={tip}
                                onChange={(e) => setTip(e.target.value)}
                            >
                                <option value={0}>Odaberite tip</option>
                                {tipovi && tipovi.map((tip) => (
                                    <option key={tip.sifra} value={tip.sifra}>
                                        {tip.naziv}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="opis">
                            <Form.Label>Opis</Form.Label>
                            <Form.Control type="text" name="opis" required
                                defaultValue={put.opis} />
                        </Form.Group>


                        <hr style={{ marginTop: '50px', border: '0' }} />

                        <Row>
                            <Col>
                                <Link to={RouteNames.PUTEVI} className="btn btn-danger">
                                    Odustani
                                </Link>
                            </Col>
                            <Col>
                                <Button type="submit" variant="success">
                                    Promjeni Tip
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="mb-4">Oznake</Card.Title>

                                {/* Autocomplete pretraga */}
                                <Form.Group className="mb-3 position-relative">
                                    <Form.Label className="fw-bold">Dodaj oznaku</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Pretraži oznake..."
                                        value={pretragaOznaka}
                                        onChange={(e) => {
                                            setPretragaOznaka(e.target.value)
                                            setPrikaziAutocomplete(e.target.value.length > 0)
                                            setOdabraniIndex(-1)
                                        }}
                                        onFocus={() => setPrikaziAutocomplete(pretragaOznaka.length > 0)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    {prikaziAutocomplete && filtrirajOznake().length > 0 && (
                                        <div className="position-absolute w-100 bg-white border rounded shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                            {filtrirajOznake().map((oznaka, index) => (
                                                <div
                                                    key={oznaka.sifra}
                                                    className="p-2 cursor-pointer"
                                                    style={{
                                                        cursor: 'pointer',
                                                        backgroundColor: index === odabraniIndex ? '#007bff' : 'white',
                                                        color: index === odabraniIndex ? 'white' : 'black'
                                                    }}
                                                    onClick={() => dodajOznaku(oznaka)}
                                                    onMouseEnter={(e) => {
                                                        setOdabraniIndex(index)
                                                    }}
                                                >
                                                    {oznaka.naziv}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Form.Group>

                                {/* Tablica odabranih polaznika */}
                                {odabraneOznake.length > 0 && (
                                    <div style={{ overflow: 'auto', maxHeight: '300px' }}>
                                        <Table striped bordered hover size="sm">
                                            <thead>
                                                <tr>
                                                    <th>Naziv</th>
                                                    <th style={{ width: '80px' }}>Akcija</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {odabraneOznake.map(oznaka => (
                                                    <tr key={oznaka.sifra}>
                                                        <td>{oznaka.naziv} </td>
                                                        <td>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => ukloniOznaku(oznaka.sifra)}
                                                            >
                                                                Obriši
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                                {odabraneOznake.length === 0 && (
                                    <p className="text-muted">Nema odabranih oznaka</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </>
    )
}