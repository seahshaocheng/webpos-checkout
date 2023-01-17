import React from "react";
import {  useSelector } from "react-redux";
import { Link, useParams, useLocation } from "react-router-dom";

export const Message = ({ type, reason }) => {
  let msg, img;
  switch (type) {
    case "pending":
      msg = <span>Your order has been received! Payment completion pending.</span>;
      img = "success";
      break;
    case "failed":
      msg = <span>The payment was refused. Please try a different payment method or card.</span>;
      img = "failed";
      break;
    case "error":
      msg = (
        <span>
          Error! Reason: {reason || "Internal error"}, refer to&nbsp;
          <a href="https://docs.adyen.com/development-resources/response-handling">Response handling.</a>
        </span>
      );
      img = "failed";
      break;
    default:
      msg = <span>You have successfully paid.</span>;
      img = "success";
  }

  return (
    <>
      <img src={`/images/${img}.svg`} className="status-image" alt={img} />
      {["failed", "error"].includes(type) ? null : <img src="/images/thank-you.svg" className="status-image" alt="thank-you" />}
      <p className="status-message">{msg}</p>
    </>
  );
};

export const StatusContainer = () => {
  const payment = useSelector(state => state.payment);
  console.log("payment response");
  console.log(payment.paymentRes);
  let { type , reference} = useParams();
  let query = new URLSearchParams(useLocation().search);
  let reason = query ? query.get("reason") : "";
  console.log("reason from adyen");
  console.log(reason);

  return (
    <div className="status-container">
      <div className="status text-center">
        <Message type={type} reason={reason}  reference={reference}/>
        <Link to="/" className="button">
          Back to home
        </Link>
      </div>
    </div>
  );
}
