import React, { useState , useEffect} from "react";
import {Alert} from 'react-bootstrap';
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import {Catalog} from './pages/Catalog';
import {Cart} from './pages/Cart';
import {Config} from './pages/Config';
import {StatusContainer} from './pages/status/Status';
import Scanner from "./components/scanner";

import { addToCart } from "./app/cartSlice";
import { useDispatch, useSelector } from "react-redux";

import "./App.css";
import "./products.css";
import 'bootstrap/dist/css/bootstrap.css';


const App = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const config = useSelector((state) => state.config);
  const [decodedText, setDecodedText] = useState([]);
  const [html5QrCode, sethtml5QrCode] = useState({});
  function handleQuickResponse(data) {
    //const history = useHistory();
    let id = data.result.text;
    dispatch(addToCart(id));
    navigate('/cart');
  }
  return(
    <React.Fragment>
      <header id="header" className="text-center" style={{"marginTop":"30px","marginBottom":"50px"}}>
        <Link to="/">
          <img src="/images/mystore-logo.svg" style={{width:"10em"}} alt="" />
        </Link>
        <div>
          {(config.terminalId===null || config.posId===null || config.currency===null)?
            <Alert variant="warning">
              Please complete the configuration <Link to="/config">here!</Link>
            </Alert>:
            <img src={`/images/success.svg`} className="status-image" alt="success" style={{width:"1em"}} />
          }
        </div>
      </header>
      <div className="container-fluid">
        <Routes>
          <Route path="/" element={<Catalog/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/config" element={<Config/>}/>
          <Route path="/status/:type" element={<StatusContainer/>}/>
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
