import Scanner from "../components/scanner";
import React, { useState , useEffect} from "react";
import products from "../data/product";
import Cart from "../pages/Cart";
import { addToCart } from "../app/cartSlice";
import { useDispatch, useSelector } from "react-redux";

export const EndlessAisle = () => {
  const dispatch = useDispatch();
  const [decodedText, setDecodedText] = useState([]);
  const [html5QrCode, sethtml5QrCode] = useState({});

  function handleQuickResponse(data) {
    let id = data.result.text;
    dispatch(addToCart(id));
  }

  return (
    <React.Fragment>
        <Cart/>
        <Scanner
        handleQuickResponse={handleQuickResponse}
        sethtml5QrCode={sethtml5QrCode}
        html5QrCode={html5QrCode}
        ></Scanner>
    </React.Fragment>
  );
}