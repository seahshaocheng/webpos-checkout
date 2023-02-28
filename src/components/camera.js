import React, {useState} from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useDispatch, useSelector } from "react-redux";

import { Button, Form } from "react-bootstrap";

export const CameraApp = (props) => {

  const [dataUri, setDataUri] = useState(null);
  const [customerEmail,setCustomerEmail] = useState(null);

  const [photoReady, setPhotoReady] = useState(false);

  function handleTakePhoto (dataUri) {
    // Do stuff with the photo...
    setDataUri(dataUri);
  }

  const sendPhotoReceipt = async () => {
    let server = process.env.REACT_APP_MERCHANT_SERVER_URL;
    const response = await fetch(`${server}/emailSelfie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
            name:"Mark Seah",
            title:"Implementation Manager Asia-Pacific",
            contactEmail:"mark.seah@adyen.com",
            customerEmail,
            photo:dataUri,
        })
      });
      console.log(server);
  }

  const handleRetakePhoto = () => {
    setDataUri(null);
  }

  return (
    <React.Fragment>
        <div style={{textAlign:"center"}}>
            {
                (dataUri)?
                <div className="sendPhotoWrapper">
                    <img src={dataUri} />
                    <br/><br/>
                    <Form.Group className="col-xs-12 col-md-6" style={{margin:"auto"}}>
                        <Form.Control type="email" placeholder="Enter customer's email address" onChange={(e)=>setCustomerEmail(e.target.value)}/>
                    </Form.Group>
                    <br/>
                    <Button style={{margin:"0px 1em"}} onClick={()=>sendPhotoReceipt()}> Send Photo Receipt</Button>
                    <Button onClick={() => handleRetakePhoto()}> Retake Photo</Button>
                </div>
                :
                  <React.Fragment>
                    <Camera
                      onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                      sizeFactor="0.3"
                      imageCompression = "0.5"
                      idealResolution = {{width: 640, height: 480}}
                    />
                    <br/>
                    <br/>
                  </React.Fragment>
                  
                }
        </div>
    </React.Fragment>
  );
}