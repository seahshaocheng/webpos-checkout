import React, {useState} from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useDispatch, useSelector } from "react-redux";

import { Button, Form,Spinner,Modal } from "react-bootstrap";

export const CameraApp = (props) => {
  
  const config = useSelector((state) => state.config);
  const [dataUri, setDataUri] = useState(null);
  const [customerEmail,setCustomerEmail] = useState(null);

  const [disableSendPhoto, setDisableSendPhoto] = useState(false);
  const [displaySuccessfulSentPhoto,setDisplaySuccessfulSentphoto] = useState(false);
  
  const [EmailResultTitle,setEmailResultTitle] = useState(null);
  const [EmailResultBody,setEmailResultBody] = useState(null);
  const [EmailResultVariant,setEmailResultVariant] = useState(null);

  function handleTakePhoto (dataUri) {
    // Do stuff with the photo...
    setDataUri(dataUri);
  }

  function ValidateEmail(email) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
  {
    return (true)
  }
    return (false)
}

  const sendPhotoReceipt = async () => {
    let server = process.env.REACT_APP_MERCHANT_SERVER_URL;
    setDisableSendPhoto(true);

    if(customerEmail!==config.selfieCCreceipt){
      if(ValidateEmail(customerEmail) && ValidateEmail(config.selfieCCreceipt)){   
        const response = await fetch(`${server}/emailSelfie`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify({
              name:config.selfieCCreceiptName,
              title:config.selfieCCpersonTitle,
              contactEmail:config.selfieCCreceipt,
              contact:config.selfieCCpersonContact,
              customerEmail,
              photo:dataUri,
          })
        });

        if(response.status === 200){
          setDisableSendPhoto(false);
          setDataUri(null);
          setEmailResultTitle("Success");
          setEmailResultBody("Successfully sent selfie to your prospect");
          setEmailResultVariant("primary");
          setDisplaySuccessfulSentphoto(true);
          //show pop up successfully sent email;
        }
        else{
          //show pop up something went wrong with email
          setDisableSendPhoto(false);
          setDataUri(null);
          setEmailResultTitle("Oops....");
          setEmailResultBody("Something went wrong.. I am so sorry. For now just pass your namecard and sign with your pen...");
          setEmailResultVariant("danger");
          setDisplaySuccessfulSentphoto(true);
        }
      }
      else{
        setDisableSendPhoto(false);
        setEmailResultTitle("Oops....");
        setEmailResultBody("One of the email (yours or the prospect) is not valid");
        setEmailResultVariant("danger");
        setDisplaySuccessfulSentphoto(true);
      }
    }
    else{
        setEmailResultTitle("Oops....");
        setEmailResultBody("Please don't try to send to yourself ("+config.selfieCCreceipt+"), send to another email");
        setEmailResultVariant("danger");
        setDisplaySuccessfulSentphoto(true);
    }
    
  }

  const handleRetakePhoto = () => {
    setDataUri(null);
  }

  const handleCloseDialog = () => {
    setDisableSendPhoto(false);
    setDisplaySuccessfulSentphoto(false);
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
                    <Button style={{margin:"0px 1em"}} onClick={()=>sendPhotoReceipt()}>
                        {
                          !disableSendPhoto?
                              "Send Photo Receipt"
                          :
                          <React.Fragment>
                              <Spinner animation="border" size="sm" role="status" as="span" variant="light" />     
                              <span>  Waiting... </span> 
                          </React.Fragment>
                        }
                     </Button>
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
        <Modal
                show = {displaySuccessfulSentPhoto}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                    <Modal.Body style={{
                        textAlign:"center",
                        }}>
                          <h4>{EmailResultTitle}</h4>
                          {EmailResultBody}
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
                                variant={EmailResultVariant}
                                onClick={() => handleCloseDialog()}>
                                    OK
                            </Button>
                        </div>
                    </Modal.Footer>
            </Modal>
    </React.Fragment>
  );
}