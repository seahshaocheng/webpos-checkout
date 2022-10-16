import React, { useState , useEffect} from "react";
import {Alert, Form} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { saveConfig } from "../app/configSlice";

export const Config = () => {

    const dispatch = useDispatch();
    const config = useSelector((state) => state.config)
    const [terminalId,setTerminalId] =  useState(null);
    const [posId,setPosId] = useState(null);
    const [currency,setCurrency] = useState(null);
 

    const local_saveConfig = () =>{
        let changedConfig = {
            terminalId,
            posId,
            currency
        }
        console.log("clicked");
        console.log(changedConfig);
        dispatch(saveConfig(changedConfig))
    }

    return(
        <React.Fragment>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Terminal ID</Form.Label>
                    <Form.Control type="text" 
                        value={config.terminalId}
                        onChange = {(e) => setTerminalId(e.target.value) } />
                    <Form.Text className="text-muted">
                        Enter the serial number of the terminal this POS is connecting to
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label>POS ID</Form.Label>
                    <Form.Control type="text" 
                        value={config.posId}
                        onChange = {(e) => setPosId(e.target.value) }/>
                    <Form.Text className="text-muted">
                        Enter something to uniquely identify this machine
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Currency</Form.Label>
                    <Form.Control type="text" 
                        value={config.currency}
                        onChange = {(e) => setCurrency(e.target.value) }/>
                    <Form.Text className="text-muted">
                        Enter ISO code of the currency e.g: (SGD,JPY)
                    </Form.Text>
                </Form.Group>
            </Form>
            <div className="fixed-bottom" style={{"bottom":"5em"}}>
                <div className="d-grid gap-2 col-8 mx-auto" style={{"marginTop":"2em"}}>
                    <button
                        className="btn btn-primary"
                        onClick={(e)=>local_saveConfig(e)}
                        >
                        Save
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
};
