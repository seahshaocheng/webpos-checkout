import React, { useState , useEffect} from "react";
import {Alert, Spinner, Button, Modal} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../app/cartSlice";

export const Catalog = () => {
    const cart = useSelector((state) => state.cart);
    const config = useSelector((state) => state.config);
    const [selectedItemId,setSelectedItemId] =  useState(null);
    const [selectedItemData,setSelectedItemData] = useState(null)
    const [showAddToCartDialog,setShowAddToCartDialog] = useState(false);
    const [selectedmatch,setSelectedMatch] = useState(null)
    const [showPBLDialog,setShowPBLDialog] = useState(false);
    const [PBLQR,setPBLQR] = useState(null);
    const dispatch = useDispatch();

    const handleSelectedProduct = (data) => {
        setSelectedItemData(data);
        setSelectedItemId(data.id);
        setShowAddToCartDialog(true);
    }

    const handleCloseAddToCartDialog = () => {
        setSelectedItemData(null);
        setSelectedItemId(null);
        setShowAddToCartDialog(false);
    }

    const handleAddToCart = ()  => {
        handleCloseAddToCartDialog();
        dispatch(addToCart(selectedItemId));
    }

    const handleSelectedMatch = async (data) =>  {
        setSelectedMatch(data);
        let server = process.env.REACT_APP_MERCHANT_SERVER_URL;
        let theme_id = null;
        if(selectedmatch === "chelbou"){
            theme_id="307f32e3-3fa0-4957-97f3-b2963e85d100";
        }
        else{
            theme_id="779aea6d-e81f-4de6-8b34-0e8c9ec56aeb";
        }
        let newPaymentRequest = {
            "amount": {
                "value":1000,
                "currency": "SGD"
            },
            "theme_id":theme_id,
            "returnUrl": "https://www.adyen.com/",
            "shopperEmail":"seah.marksc@gmail.com"
        }
        const response = await fetch(`${server}/paymentLink`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body:JSON.stringify(newPaymentRequest)
        });

        let paymentLinkResponse = await response.json();
        if(paymentLinkResponse.qrCode!==null && paymentLinkResponse.qrCode!==undefined){
            setPBLQR(paymentLinkResponse.qrCode);
        }
        setShowPBLDialog(true);
    }

    const handleclosePBLDialog = () => {
        setPBLQR(null);
        setShowPBLDialog(false);
        setSelectedMatch(null);
    }

    return(
        <React.Fragment>
            {cart.products?.length > 0 ? (
                <ul class="products__list d-flex align-content-stretch flex-wrap">
                    {cart.products?.map((data, i) => (
                            <li className="products__list__list-item ">
                                <a className="products__list__list-item__item" onClick = {() => handleSelectedProduct(
                                    data
                                )}>
                                    <img src={data.image} alt="Polo shirt" className="lazyload-image lazyload-image--loaded products__list__list-item__item__image"/>
                                    <p className="products__list__list-item__item__title">{data.title}</p>
                                    <p className="products__list__list-item__item__price">
                                        {config.currency}
                                        {data.price.value/Math.pow(10,data.price.precision)}
                                    </p>
                                </a>
                            </li>
                        ))}
                        <li className="products__list__list-item ">
                                <a className="products__list__list-item__item" onClick = {() => handleSelectedMatch(
                                    "chelbou"
                                )}>
                                    <img src="/images/starhub/bou-chel.jpg" alt="ChelseavsBou" style={{width:"100%"}}/>
                                    <p className="products__list__list-item__item__title">CHE vs BOU </p>
                                    <p className="products__list__list-item__item__price">
                                        {config.currency}
                                        {1000/Math.pow(10,2)}
                                    </p>
                                </a>
                            </li>
                            <li className="products__list__list-item ">
                                <a className="products__list__list-item__item" onClick = {() => handleSelectedMatch(
                                    "chelars"
                                )}>
                                    <img src="/images/starhub/ars-chel.jpg" alt="ChelArs" style={{width:"100%"}}/>
                                    <p className="products__list__list-item__item__title">CHE vs ARS </p>
                                    <p className="products__list__list-item__item__price">
                                        {config.currency}
                                        {1000/Math.pow(10,2)}
                                    </p>
                                </a>
                            </li>
                </ul>
            ) : 
                <Alert variant='dark'>
                    No products configured.
                </Alert>
            }

            <Modal
                show = {showAddToCartDialog}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleCloseAddToCartDialog}
                >   
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body style={{
                        textAlign:"center",
                        }}>
                        {
                            (selectedItemData!==null)?
                                <React.Fragment>
                                    <h4>{selectedItemData.title}</h4>
                                    <img src={selectedItemData.image} alt="Polo shirt" class="lazyload-image lazyload-image--loaded products__list__list-item__item__image"/>
                                    <p class="products__list__list-item__item__price">
                                                {config.currency}
                                                {selectedItemData.price.value/Math.pow(10,selectedItemData.price.precision)}
                                    </p>
                                </React.Fragment>
                            :
                            ""
                        }
                       
                    </Modal.Body>
                    <Modal.Footer
                        style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow:"break-word"
                        }}>
                        <div className="d-grid gap-2 col-8 mx-auto" style={{"marginTop":"2em"}}>
                            <Button 
                                size="lg"
                                variant="primary"
                                onClick={() => handleAddToCart()}>
                                    Add to Cart
                            </Button>
                        </div>
                    </Modal.Footer>
            </Modal>

            <Modal
                show = {showPBLDialog}
                fullscreen={true}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleCloseAddToCartDialog}
                >   
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body style={{
                        textAlign:"center", position:"relative"
                        }}>
                            {
                                (selectedmatch==="chelbou")?
                                    <img src="/images/starhub/bou-chel.jpg" style={{widht:"100%"}}/>:
                                    <img src="/images/starhub/ars-chel.jpg" style={{widht:"100%"}}/>
                            }
                        <img src="/images/starhub/ars-chel.jpg" style={{widht:"100%"}}/>
                        <div className="qrCodeWrapper">
                            <span>Scan to pay</span>
                            {(PBLQR!==null)?<img src={PBLQR} className="qr-code"/>:""}
                            
                        </div>
                    </Modal.Body>
                    <Modal.Footer
                        style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow:"break-word"
                        }}>
                        <div className="d-grid gap-2 col-8 mx-auto" style={{"marginTop":"2em"}}>
                            <Button 
                                size="lg"
                                variant="primary"
                                onClick={() => handleclosePBLDialog()}>
                                    Close Demo
                            </Button>
                        </div>
                    </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
};
