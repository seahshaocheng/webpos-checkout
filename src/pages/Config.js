import React, { useState , useEffect} from "react";
import {Alert, Form, Button, InputGroup} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { saveConfig } from "../app/configSlice";
import {useNavigate} from "react-router-dom";

export const Config = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const config = useSelector((state) => state.config)
    const [terminalId,setTerminalId] =  useState(null);
    const [posId,setPosId] = useState(null);
    const [currency,setCurrency] = useState(null);
    const [availableTerminals, setAvailableTerminals] = useState([]);
    
    const fetchTerminal = async() => {
        let server = process.env.REACT_APP_MERCHANT_SERVER_URL;
        const response = await fetch(`${server}/fetchTerminals`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });
        let responseBody = await response.json();
        console.log(responseBody);

        setAvailableTerminals(responseBody);
        return responseBody;
    }

    useEffect(()=>{
        setCurrency(config.currency);
        setTerminalId(config.terminalId);
        setPosId(config.posId);
        fetchTerminal();
    },[]);

    const local_saveConfig = (e) =>{
        let changedConfig = {
            terminalId,
            posId,
            currency
        }
        dispatch(saveConfig(changedConfig))
        //navigate('/cart');
    }

    return(
        <React.Fragment>
            <Form style={{paddingBottom:"10em"}}>
                <Form.Group as="column" className="mb-3">
                    <Form.Label>Terminal ID</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Select onChange = {(e) => setTerminalId(e.target.value) }>
                            {
                                availableTerminals.map((terminal,i)=>{
                                    return(
                                        <option>{terminal.POIID}</option>
                                    )
                                })
                            }
                            </Form.Select>
                        <Button variant="outline-secondary" onClick = {() =>fetchTerminal }>
                            Refresh
                        </Button>
                    </InputGroup>
                    <Form.Text className="text-muted">
                        Enter the serial number of the terminal this POS is connecting to
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label>POS ID</Form.Label>
                    <Form.Control type="text" 
                        value={posId}
                        onChange = {(e) => setPosId(e.target.value) }/>
                    <Form.Text className="text-muted">
                        Enter something to uniquely identify this machine
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Currency</Form.Label>
                    <Form.Control type="text" 
                        value={currency}
                        onChange = {(e) => setCurrency(e.target.value) }/>
                    <Form.Text className="text-muted">
                        Enter ISO code of the currency e.g: (SGD,JPY)
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <div style={{"bottom":"5em"}}>
                        <div className="d-grid gap-2 col-12 mx-auto" style={{"marginTop":"2em"}}>
                            <button
                                className="btn btn-primary"
                                onClick={(e)=>local_saveConfig(e)}
                                >
                                Save
                            </button>
                        </div>
                    </div>
                </Form.Group>
            </Form>
        </React.Fragment>
    )
};
