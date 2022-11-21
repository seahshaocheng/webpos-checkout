import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
import { initiateCheckout } from "../app/paymentSlice";
import { getRedirectUrl } from "../util/redirect";

export const PaymentContainer = () => {
  return (
    <div id="payment-page">
        <Checkout/>
    </div>
  );
}

const Checkout = (props) => {
  const dispatch = useDispatch();
  const payment = useSelector(state => state.payment);
  let paymentRequestData = payment.paymentRequestData;

  const navigate = useNavigate();
  const paymentContainer = useRef(null);


  useEffect(() => {
    const { config, session } = payment;

    dispatch(initiateCheckout(payment.adyenenv,payment.region));

    if (!session || !paymentContainer.current) {
      // initiateCheckout is not finished yet.
      return;
    }
    const createCheckout = async () => {
      console.log("creating");
     console.log(config);
      const checkout = await AdyenCheckout({
        ...config,
        session,
        onPaymentCompleted: (response, _component) =>{
          console.log("Payment completed");
          console.log(response);
          navigate(getRedirectUrl(response.resultCode), { replace: true })
        },
        onError: (error, _component) => {
          console.error(error);
          navigate(`/status/error?reason=${error.message}`, { replace: true });
        },
      });

      if (paymentContainer.current) {
        console.log("test");
        checkout.create("dropin").mount(paymentContainer.current);
      }
    }
    createCheckout();
  }, [payment, navigate])

  return (
    <div className="row">
      <div className="payment-container col-4">
        <div ref={paymentContainer} className="payment"></div>
      </div>
    </div>
  );
}