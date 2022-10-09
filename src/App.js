import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import {DemoHome} from './pages/DemoHome';
import {EndlessAisle} from './pages/EndlessAisle';

import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
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
          <Route path="/endless-ailse" element={<EndlessAisle/>}/>
        </Routes>
      </div>
      
    </React.Fragment>
    
  )
}

export default App;
