import React, { useState , useEffect} from "react";
import {Alert, Spinner, Button, Modal, Form} from "react-bootstrap";
import { clearCart } from "../app/cartSlice";
import {PaymentContainer} from "../pages/Checkout";
import { useDispatch, useSelector } from "react-redux";

import { initiateCheckout,clearSessiondata,updatePaymentRequestData, updatePaymentAmount} from "../app/paymentSlice";

export const Cart = () => {
    const cart = useSelector((state) => state.cart);
    const config = useSelector((state) => state.config);
    const payment = useSelector((state) => state.payment);
    const dispatch = useDispatch();

    const [paymentButtonDisabled,setPaymentButtonDisabled] =  useState(false);
    const [paymentResultModalDisplay,setPaymentResultModalDisplay] = useState(false);
    const [paymentResultmodalButtonVariant,setPaymentResultmodalButtonVariant] = useState("primary");
    const [paymentResultImage,setPaymentResultImage] = useState("success");
    const [paymentResultTitle,setpaymentResultTitle] = useState(null);
    const [paymentSubTitle,setPaymentSubTitle] = useState(null);
    const [paymentResultBody,setpaymentResultBody] = useState(null);
    const [emailReceiptSwtich,setEmailReceiptSwtich] = useState(false);
    const [customerEmail,setCustomerEmail] = useState(null);

    const calculateCartTotal = () => {
        return cart.total/Math.pow(10,cart.totalPrecision);
    }

    const handleAdditionalResponse = (additionalResponse) => {
        let splitedResponse =  additionalResponse.split("&");
        let parsedAdditionalResponse = {};
        for(var i = 0 ; i < splitedResponse.length; i++ ){
            let valuepair = splitedResponse[i].split("=");
            parsedAdditionalResponse[valuepair[0]]=decodeURIComponent(valuepair[1]);
        }
        return parsedAdditionalResponse;
    }

    const handlePaymentResponse = (terminalResponse) => {

        if(terminalResponse.PaymentResponse.Response){
            let paymentResult = terminalResponse.PaymentResponse.Response.Result;
            switch(paymentResult){
                case "Success":
                    setPaymentResultImage("success");
                    setpaymentResultTitle("Successful Payment");
                    setPaymentSubTitle("Transaction ID:")
                    setpaymentResultBody(terminalResponse.PaymentResponse.POIData.POITransactionID.TransactionID)
                    setPaymentResultmodalButtonVariant("success");

                    if(emailReceiptSwtich){
                        let items = [];
                        let total = config.currency+" "+cart.total/Math.pow(10,cart.totalPrecision);
                        cart.cart.map((data, i)=>{
                            let item = {
                                text:data.title,
                                image:data.image,
                                price:config.currency+" "+data.gross/Math.pow(10,data.price.precision)
                            }
                            items.push(item);
                        });
                        let orderData = {
                            tenderReference:terminalResponse.PaymentResponse.POIData.POITransactionID.TransactionID,
                            items
                        }
                        //emailReceipt(orderData,total);
                    }

                break;
                case "Failure":
                    setPaymentResultImage("failed");
                    setpaymentResultTitle("Payment Failed");
                    setPaymentSubTitle("Reason:");
                    let additionalResponse = handleAdditionalResponse(terminalResponse.PaymentResponse.Response.AdditionalResponse);
                    setpaymentResultBody(additionalResponse.refusalReason);
                    setPaymentResultmodalButtonVariant("danger");
                break;
                default:
                    setPaymentResultImage("failed");
                    setPaymentResultmodalButtonVariant("danger");
                break;
            }
            setPaymentResultModalDisplay(true);
        }
    }

    const handleClosePaymentResult= () => {
        setPaymentResultModalDisplay(false);
        setPaymentButtonDisabled(false);
        dispatch(clearCart());
        dispatch(clearSessiondata());
        calculateCartTotal();
    }

    const initializeCheckout = () => {
        dispatch(initiateCheckout(payment.adyenenv,payment.region));
        setEmailReceiptSwtich(true);
    }

    const handleContinueToCheckout = () => {
        console.log("handle continue to checkout");
        dispatch(updatePaymentAmount({key:"value",value:cart.total}));
        if(!emailReceiptSwtich && config.useEcomm){
            return(<Button variant="outline-secondary" onClick = {() => initializeCheckout() }>
            Set email and Continue
        </Button>)
        }
    }

    const makePayment = async () =>{
        console.log("clicked");
        setPaymentButtonDisabled(true);
        let server = process.env.REACT_APP_MERCHANT_SERVER_URL;
        let serverEndpoint = "/makePayment";

        let paymentRequestData = {
            terminalId:config.terminalId,
            amount:cart.total/Math.pow(10,cart.totalPrecision),
            posId:config.posId,
            currency:config.currency,
            shopperEmail:payment.paymentRequestData.shopperEmail
        }

        if(config.customerLoyalty){
            serverEndpoint = "/cardacq";

            if(config.mockLoyalty){
                paymentRequestData.useMock=true;
            }
            else{
                paymentRequestData.useMock=false;
            }
        }

        const response = await fetch(`${server}${serverEndpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
            body:JSON.stringify(paymentRequestData)
        });
        let responseBody = await response.json();
        if(responseBody.SaleToPOIResponse!==undefined){
            let paymentResponse= responseBody.SaleToPOIResponse;
            handlePaymentResponse(paymentResponse);
        }
        //do handling of event
    }

    return(
        <React.Fragment>
            {cart.cart?.length > 0 ? (
                <div className="row" style={{"padding-bottom":"15em"}}>
                    <div className="col-xs-12 col-md-6 order-md-1">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="name@example.com" onChange={(e)=>dispatch(updatePaymentRequestData({key:"shopperEmail",value:e.target.value}))} />
                        </Form.Group>
                       { handleContinueToCheckout()}
                        {
                            (config.useEcomm)?
                            <PaymentContainer/>:""
                        }
                    </div>
                    <div className="col-xs-12 col-md-6 order-first order-md-2">
                        <table className="table" style={{"maxheight":"50vh","overflow":"auto"}}>
                            <thead>
                                <tr>
                                <th scope="col">Product Name</th>
                                <th scope="col">Qty</th>
                                <th scope="col">Unit Price</th>
                                <th scope="col">Unit Total</th>
                                </tr>
                            </thead>
                            {cart.cart?.map((data, i) => (
                                <tbody key={i}>
                                <tr>
                                    <td>{data.title}<br/><small class="text-muted">{data.id}</small></td>
                                    <td>{data.qty}</td>
                                    <td>{config.currency} {data.price.value/Math.pow(10,data.price.precision)}</td>
                                    <td>{config.currency} {data.gross/Math.pow(10,data.price.precision)}</td>
                                </tr>
                                </tbody>
                            ))}
                            <tfoot>
                                <tr>
                                    <th scope="col" colSpan="3" style={{"textAlign":"right"}}>Total:</th>
                                    <th scope="col">{config.currency} {cart.total/Math.pow(10,cart.totalPrecision)}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            ) : 
            <Alert variant='dark'>
                No product in cart, start scanning
            </Alert>
            }
            <div className="fixed-bottom" style={{"bottom":"5em"}}>
                <div className="d-grid gap-2 col-sm-12 col-xs-12 col-md-6 col-lg-6 mx-auto" style={{"padding":"0em .8em"}}>
                {(cart.total>0)?
                    <React.Fragment>
                        {
                            (!config.useEcomm)?
                                <Button
                                    variant ="primary"
                                    size="lg"
                                    onClick={() => makePayment()}
                                    disabled={paymentButtonDisabled}
                                    >
                                        {
                                            !paymentButtonDisabled?
                                                "Pay "+config.currency+" "+calculateCartTotal()
                                            :
                                            <React.Fragment>
                                                <Spinner animation="border" size="sm" role="status" as="span" variant="light" />     
                                                <span>  Waiting... </span> 
                                            </React.Fragment>
                                        }
                                </Button>:""
                        }
                        <Button
                            variant ="secondary"
                            size="lg"
                            onClick={() => handleClosePaymentResult()}
                            disabled={paymentButtonDisabled}>
                               Clear Cart
                        </Button>
                    </React.Fragment>
                    :""
                }
                </div>
            </div>
            <Modal
                show = {paymentResultModalDisplay}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                    <Modal.Body style={{
                        textAlign:"center",
                        }}>
                        <h4>{paymentResultTitle}</h4>
                            <img src={`/images/${paymentResultImage}.svg`} className="status-image" alt={paymentResultImage} />
                            <div style={{margin:"1em 0"}}></div>
                            {paymentSubTitle}<br/>
                            {paymentResultBody}
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
                                variant={paymentResultmodalButtonVariant}
                                onClick={() => handleClosePaymentResult()}>
                                    OK
                            </Button>
                        </div>
                    </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
};
