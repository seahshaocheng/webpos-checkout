import React, { useEffect, useState } from "react";
import {Modal} from "react-bootstrap";
import { Html5Qrcode } from "html5-qrcode";

const Scanner = ({
  html5QrCode,
  sethtml5QrCode,
  handleQuickResponse
}) => {
  const [toggleVisibility, setToggleVisibility] = useState(true);

  useEffect(() => {
    sethtml5QrCode(
      new Html5Qrcode("reader", {
        // Use this flag to turn on the feature.
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        }
      })
    );
  }, []);

  let qrboxFunction = function (viewfinderWidth, viewfinderHeight) {
    let minEdgePercentage = 0.7; // 70%
    let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
    let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
    setToggleVisibility(!toggleVisibility);
    return {
      width: qrboxSize,
      height: qrboxSize
    };
  };

  const handleClickAdvanced = () => {
    try {
      const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        handleQuickResponse(decodedResult);

        handleStop();
        setToggleVisibility((data) => !data);
        // Handle on success condition with the decoded message.
      };
      html5QrCode
        .start(
          { facingMode: "environment" },

          {
            fps: 30,
            qrbox: qrboxFunction
          },

          qrCodeSuccessCallback
          // (errorMessage) => {
          //   console.log("Err1",errorMessage)
          // }
        )
        .catch((err) => console.log("Error4", err));
    } catch (err) {
      console.log("error3", err);
    }
  };

  const handleStop = () => {
    try {
      setToggleVisibility(!toggleVisibility);
      setToggleVisibility();
      html5QrCode
        .stop()
        .then((res) => {
          html5QrCode.clear();
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (err) {
      html5QrCode.clear();
      console.log("Error2", err);
    }
  };

  return (
    <div className="fixed-bottom" style={{"bottom":"2em"}}>
        <div className="container-fluid">
            <div id="reader" width="100%" />
            <div className="d-grid gap-2 col-8 mx-auto" style={{"marginTop":"2em"}}>
            {toggleVisibility ? (
                <React.Fragment>
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            handleClickAdvanced();
                        }}
                        >
                        Scan
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            //handleClickAdvanced();
                        }}
                        >
                        Pay
                    </button>
                </React.Fragment>
                
            ) : (
                <button
                className="btn btn-secondary btn-lg"
                onClick={() => {
                    handleStop();
                    setToggleVisibility(!toggleVisibility);
                }}
                >
                Stop
                </button>
            )}
            </div>
        </div>
      </div>
    // <div style={{ position: "relative" }}>
    //   <div id="reader" width="100%" />
    // </div>
  );
};
export default Scanner;
