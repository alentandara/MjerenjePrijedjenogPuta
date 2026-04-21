import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import OznakaService from "../../services/oznake/OznakaService";
import { useEffect, useState } from "react";

export default function OznakaPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [oznaka, setOznaka] = useState({})

    useEffect(()=>{
        ucitajOznaka()
    },[])

    async function ucitajOznaka() {
        await OznakaService.getBySifra(params.sifra).then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            const s = odgovor.data
            setOznaka(s)
        })
    }

    async function promjeni(oznaka) {
        await OznakaService.promjeni(params.sifra,oznaka).then(()=>{
            navigate(RouteNames.OZNAKE)
        })
    }

     function odradiSubmit(e){ //e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        promjeni({
            naziv: podaci.get('naziv')
        })
    }


    return(
        <>
        <h3>
            Promjena Oznakaa
        </h3>
        <Form onSubmit={odradiSubmit}>
            <Form.Group controlId="naziv">
                <Form.Label>Naziv</Form.Label>
                <Form.Control type="text" name="naziv" required 
                defaultValue={oznaka.naziv}/>
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
                        Promjeni Oznaka
                    </Button>
                </Col>
            </Row>

        </Form>
        </>
    )
}