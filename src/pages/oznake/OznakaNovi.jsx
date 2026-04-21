import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import OznakaService from "../../services/oznake/OznakaService";

export default function OznakaNovi(){

    const navigate = useNavigate()

    async function dodaj(Oznaka){
        await OznakaService.dodaj(Oznaka).then(()=>{
            navigate(RouteNames.OZNAKE)
        })
    }

    async function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)


        // spremi tip zajedno sa oznakama
        await dodaj({
            naziv: podaci.get('naziv')
        })
    }

    return(
        <>
        <h3>
            Unos novog Oznakaa
        </h3>

        <Form onSubmit={odradiSubmit}>
            
            <Form.Group controlId="naziv">
                <Form.Label>Naziv</Form.Label>
                <Form.Control type="text" name="naziv" required />
            </Form.Group>

         

            <hr style={{marginTop: '50px', border: '0'}} />

            <Row>
                <Col>
                    <Link to={RouteNames.OZNAKE} className="btn btn-danger">
                        Odustani
                    </Link>
                </Col>

                <Col>
                    <Button type="submit" variant="success">
                        Dodaj novu oznaku
                    </Button>
                </Col>
            </Row>

        </Form>
        </>
    )
}