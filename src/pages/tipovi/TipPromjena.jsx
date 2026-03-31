import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import TipService from "../../services/tipovi/TipService";
import { useEffect, useState } from "react";

export default function TipPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [tip, setTip] = useState({})

    useEffect(()=>{
        ucitajTip()
    },[])

    async function ucitajTip() {
        await TipService.getBySifra(params.sifra).then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            const s = odgovor.data
            setTip(s)
        })
    }

    async function promjeni(tip) {
        await TipService.promjeni(params.sifra,tip).then(()=>{
            navigate(RouteNames.TIPOVI)
        })
    }

     function odradiSubmit(e){ //e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        promjeni({
            naziv: podaci.get('naziv'),
            opis: podaci.get('opis')
        })
    }


    return(
        <>
        <h3>
            Promjena Tipa
        </h3>
        <Form onSubmit={odradiSubmit}>
            <Form.Group controlId="naziv">
                <Form.Label>Naziv</Form.Label>
                <Form.Control type="text" name="naziv" required 
                defaultValue={tip.naziv}/>
            </Form.Group>

            <Form.Group controlId="opis">
                <Form.Label>Opis</Form.Label>
                <Form.Control type="text" name="opis" required 
                defaultValue={tip.opis}/>
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
                        Promjeni Tip
                    </Button>
                </Col>
            </Row>

        </Form>
        </>
    )
}