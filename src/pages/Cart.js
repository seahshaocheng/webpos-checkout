import React, { useState , useEffect} from "react";
import {Alert} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

export const Cart = () => {
    const cart = useSelector((state) => state.cart)

    const makePayment = async () =>{
        console.log("clicked");
        let server = process.env.REACT_APP_MERCHANT_SERVER_URL;
        const response = await fetch(`${server}/makePayment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
            body:JSON.stringify({
                terminalId:"e280-347274603",
                amount:cart.total/Math.pow(10,cart.totalPrecision),
                currency:"SGD"
            })
        });
        let responseBody = await response.json();
        console.log(responseBody);
        //do handling of event
    }

    return(
        <React.Fragment>
            {cart.cart?.length > 0 ? (
                <div>
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
                                <td>{data.price.value/Math.pow(10,data.price.precision)}</td>
                                <td>{data.gross/Math.pow(10,data.price.precision)}</td>
                            </tr>
                            </tbody>
                        ))}
                        <tfoot>
                            <tr>
                                <th scope="col" colSpan="3" style={{"textAlign":"right"}}>Total:</th>
                                <th scope="col">{cart.total/Math.pow(10,cart.totalPrecision)}</th>
                            </tr>
                        </tfoot>
                        </table>
                </div>
            ) : 
            <Alert variant='dark'>
                No product in cart, start scanning
            </Alert>
            }
            <div className="fixed-bottom" style={{"bottom":"5em"}}>
                <div className="d-grid gap-2 col-8 mx-auto" style={{"marginTop":"2em"}}>
                    <button
                        className="btn btn-primary"
                        onClick={() => makePayment()}
                        >
                        Pay {cart.total/Math.pow(10,cart.totalPrecision)}
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
};
