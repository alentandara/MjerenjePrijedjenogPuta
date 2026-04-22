import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import TipService from "../../services/tipovi/TipService";
import Oznake from "../../services/tipovi/Oznake";

export default function TipNovi(){

    const navigate = useNavigate()

    async function dodaj(Tip){
        await TipService.dodaj(Tip).then(()=>{
            navigate(RouteNames.TIPOVI)
        })
    }

    async function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)

        const oznakeLista = podaci.get('oznake')
            ? podaci.get('oznake')
                .split(',')
                .map(o => o.trim())
                .filter(o => o !== '')
            : [];

        for(const oznaka of oznakeLista){
            await Oznake.dodaj(oznaka);
        }

        await dodaj({
            naziv: podaci.get('naziv'),
            opis: podaci.get('opis'),
            oznake: oznakeLista
        })
    }

    return(
        <>
        <h3>Unos novog Tipa</h3>

        <Form onSubmit={odradiSubmit}>
            
            <Row>
                {/* LIJEVA KOLONA */}
                <Col md={6}>
                    <Form.Group controlId="naziv" className="mb-3">
                        <Form.Label>Naziv</Form.Label>
                        <Form.Control type="text" name="naziv" required />
                    </Form.Group>

                    <Form.Group controlId="opis" className="mb-3">
                        <Form.Label>Opis</Form.Label>
                        <Form.Control type="text" name="opis" required />
                    </Form.Group>

                    <Form.Group controlId="oznake" className="mb-3">
                        <Form.Label>Oznake (odvoji zarezom)</Form.Label>
                        <Form.Control type="text" name="oznake" />
                    </Form.Group>
                </Col>

                {/* DESNA KOLONA - PRAZNA POLJA */}
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>&nbsp;</Form.Label>
                        <Form.Control type="text" placeholder="" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>&nbsp;</Form.Label>
                        <Form.Control type="text" placeholder="" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>&nbsp;</Form.Label>
                        <Form.Control type="text" placeholder="" />
                    </Form.Group>
                </Col>
            </Row>

            <hr style={{marginTop: '50px', border: '0'}} />

            <Row>
                <Col>
                    <Link to={RouteNames.TIPOVI} className="btn btn-danger">
                        Odustani
                    </Link>
                </Col>

                <Col className="text-end">
                    <Button type="submit" variant="success">
                        Dodaj novi Tip
                    </Button>
                </Col>
            </Row>

        </Form>
        </>
    )
}