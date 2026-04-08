import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import TipService from "../../services/tipovi/TipService";
import { useEffect, useState } from "react";
import PutService from "../../services/putevi/PutService";

export default function duzinaPuta(){

    const navigate = useNavigate()
    const params = useParams()
    const [tipovi, setTipovi] = useState([])
    const [tip, setTip] = useState(0)
    const [put, setPut] = useState({})

    useEffect(()=>{
        ucitajPut()
        ucitajTipove()
    },[])

    async function ucitajPut() {
            await PutService.getBySifra(params.sifra).then((odgovor)=>{
                if(!odgovor.success){
                    alert('Nije implementiran servis')
                    return
                }
                const s = odgovor.data
                setPut(s)
                setTip(s.tip)
            })
        }

    async function ucitajTipove() {
        await TipService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            const s = odgovor.data
            setTipovi(s)
            
        })
    }

    async function promjeni(put) {
        await PutService.promjeni(params.sifra,put).then(()=>{
            navigate(RouteNames.PUTEVI)
        })
    }

     function odradiSubmit(e){ //e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        promjeni({
            naziv: podaci.get('naziv'),
            opis: podaci.get('opis'),
            tip: podaci.get('tip')
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
                defaultValue={put.naziv}/>
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
                defaultValue={put.opis}/>
            </Form.Group>
           

            <hr style={{marginTop: '50px', border: '0'}} />

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

        </Form>
        </>
    )
}