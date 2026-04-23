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

    
        await dodaj({
            naziv: podaci.get('naziv'),
            opis: podaci.get('opis')
        })
    }

    // 🔥 GENERIRAJ TIP + OZNAKE
    async function generirajTip(){

        const nazivi = ["Hodanje", "Trčanje", "Bicikl", "Planinarenje"];
        const oznakePool = ["brzo", "sporo", "uzbrdo", "ravno", "teško", "lagano"];

        const naziv = nazivi[Math.floor(Math.random() * nazivi.length)];
        const opis = "Auto generirani tip";

        const brojOznaka = Math.floor(Math.random() * 3) + 2;

        const oznakeLista = oznakePool
            .sort(() => 0.5 - Math.random())
            .slice(0, brojOznaka);

        for(const oznaka of oznakeLista){
            await Oznake.dodaj(oznaka);
        }

        await dodaj({
            naziv,
            opis,
            oznake: oznakeLista
        })
    }

    return(
        <>
        <h3>Unos novog Tipa</h3>

        <Button variant="warning" onClick={generirajTip}>
            ⚡ Generiraj tip
        </Button>

        <hr />

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