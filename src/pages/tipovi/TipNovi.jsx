import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import TipService from "../../services/tipovi/TipService";

export default function TipNovi(){

    const navigate = useNavigate()

    async function dodaj(Tip){
        //console.table(Tip) // ovo je za kontrolu da li je sve OK
        await TipService.dodaj(Tip).then(()=>{
            navigate(RouteNames.TIPOVI)
        })
    }


    function odradiSubmit(e){ //e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        dodaj({
            naziv: podaci.get('naziv'),
            opis: podaci.get('opis')
        })
    }

    return(
        <>
        <h3>
            Unos novog Tipa
        </h3>
        <Form onSubmit={odradiSubmit}>
            <Form.Group controlId="naziv">
                <Form.Label>Naziv</Form.Label>
                <Form.Control type="text" name="naziv" required />
            </Form.Group>

            <Form.Group controlId="opis">
                <Form.Label>Opis</Form.Label>
                <Form.Control type="text" name="opis" required />
            </Form.Group>
           

            <hr style={{marginTop: '50px', border: '0'}} />

            <Row>
                <Col>
                    <Link to={RouteNames.TIPOVI} className="btn btn-danger">
                    Odustani
                    </Link>
                </Col>
                <Col>
                    <Button type="submit" variant="success">
                        Dodaj novi Tip
                    </Button>
                </Col>
            </Row>

        </Form>
        </>
    )
}