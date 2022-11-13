import React, { useState , useEffect} from "react";
import {Alert, Form, Button, InputGroup} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { saveConfig } from "../app/configSlice";
import {useNavigate} from "react-router-dom";

export const Config = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const config = useSelector((state) => state.config);
    const [store,setStore] = useState(null);
    const [terminalId,setTerminalId] =  useState(null);
    const [posId,setPosId] = useState(null);
    const [currency,setCurrency] = useState(null);
    const [customerLoyalty,setCustomerLoyalty] = useState(null);
    const [mockLoyalty,setMockLoyalty] = useState(null);
    const [availableTerminals, setAvailableTerminals] = useState([]);
    const [availableStores,setAvailableStores] = useState([]);
    
    useEffect(()=>{
        console.log("effecting");
        setStore(config.store);
        setCurrency(config.currency);
        setTerminalId(config.terminalId);
        setPosId(config.posId);
        setCustomerLoyalty(config.customerLoyalty);
        setMockLoyalty(config.mockLoyalty);
        fetchStore();
        if(config.store!==null){
            fetchTerminal(config.store)
        }
    },[]);
    
    const fetchTerminal = async(store) => {
        console.log("fetching terminal");
        let server = process.env.REACT_APP_MERCHANT_SERVER_URL;
        let data = {};
        console.log("thge store: ",store);
        if(store!==null){
            data['store']=store;
        }
        console.log("the data",data);
        const response = await fetch(`${server}/fetchTerminals`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify(data)
        });
        let responseBody = await response.json();

        setAvailableTerminals(responseBody);
        return responseBody;
    }

    const fetchStore = async () => {
        console.log("fetching store");
        let server = process.env.REACT_APP_MERCHANT_SERVER_URL;
        const response = await fetch(`${server}/fetchStores`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });
        let responseBody = await response.json();

        setAvailableStores(responseBody);
        return responseBody;
    }

    const handOnChangeTerminal = (e) =>{
        console.log("changing terminal");
        console.log(e.target.value);
    } 

    const handleOnChangeStore = (e) => {
        console.log("changingStore");
        setStore(e);
        fetchTerminal(e);
    }

    const local_saveConfig = (e) =>{
        e.preventDefault();
        let changedConfig = {
            store,
            terminalId,
            posId,
            currency,
            customerLoyalty,
            mockLoyalty
        }
        console.log(changedConfig)
        dispatch(saveConfig(changedConfig))
        //navigate('/cart');
    }

    const handleCustomerLoyaltySwitch = (e)=>{
        setCustomerLoyalty(!customerLoyalty);
    } 

    const handleMockLoyalty = (e)=>{
        setMockLoyalty(!mockLoyalty);
    } 

    return(
        <React.Fragment>
            <Form style={{paddingBottom:"10em"}}>
                <Form.Group className="mb-3">
                    <Form.Label>Store</Form.Label>
                    <InputGroup>
                        <Form.Select onChange = {(e) => handleOnChangeStore(e.target.value) }>
                            <option>{(store===null)?"Please select store":store}</option>
                            {
                                availableStores.map((configuredstore,i)=>{
                                    return(
                                        <option>{configuredstore}</option>
                                    )
                                })
                            }
                            </Form.Select>
                        <Button variant="outline-secondary" onClick = {() => fetchStore() }>
                            Refresh
                        </Button>
                    </InputGroup>
                    <Form.Text className="text-muted">
                        Select the store for this POS
                    </Form.Text>
                </Form.Group>
                {(store!==null && availableTerminals.length>0)?
                <Form.Group className="mb-3">
                    <Form.Label>Terminal ID</Form.Label>
                    <InputGroup>
                        <Form.Select onChange = {(e) => setTerminalId(e.target.value) }>
                            <option>{(terminalId===null)?"Please select terminal":terminalId}</option>
                            {
                                availableTerminals.map((terminal,i)=>{
                                    return(
                                        <option>{terminal.POIID}</option>
                                    )
                                })
                            }
                            </Form.Select>
                        <Button variant="outline-secondary" onClick = {() =>fetchTerminal() }>
                            Refresh
                        </Button>
                    </InputGroup>
                    <Form.Text className="text-muted">
                        Select terminal for POS to connect
                    </Form.Text>
                </Form.Group>:""}
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
                    <Form.Check 
                                type="switch"
                                id="emailReceipt"
                                label="Perform Loyalty Flow"
                                checked={customerLoyalty}
                                onChange={handleCustomerLoyaltySwitch}
                        />
                </Form.Group>
                <Form.Group>
                    <Form.Check 
                                type="switch"
                                id="useMock"
                                label="Use Mock for Loyalty"
                                checked={mockLoyalty}
                                onChange={handleMockLoyalty}
                        />
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

