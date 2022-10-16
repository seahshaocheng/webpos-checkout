import React, { useState , useEffect} from "react";
import { Routes, Route, Link } from "react-router-dom";

import {DemoHome} from './pages/DemoHome';
import {Cart} from './pages/Cart';
import {Config} from './pages/Config';
import Scanner from "./components/scanner";

import { addToCart } from "./app/cartSlice";
import { useDispatch, useSelector } from "react-redux";

import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
  const dispatch = useDispatch();
  const [decodedText, setDecodedText] = useState([]);
  const [html5QrCode, sethtml5QrCode] = useState({});
  function handleQuickResponse(data) {
    let id = data.result.text;
    dispatch(addToCart(id));
  }
  return(
    <React.Fragment>
      <header id="header" className="text-center" style={{"marginTop":"30px","marginBottom":"50px"}}>
        <Link to="/">
          <img src="/images/mystore-logo.svg" alt="" />
        </Link>
      </header>
      <div className="container-fluid">
        <Routes>
          <Route path="/" element={<DemoHome/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/config" element={<Config/>}/>
        </Routes>
        <Scanner
        handleQuickResponse={handleQuickResponse}
        sethtml5QrCode={sethtml5QrCode}
        html5QrCode={html5QrCode}
        ></Scanner>
      </div>
    </React.Fragment>
    
  )
}

export default App;
