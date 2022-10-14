import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
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
    <div className="fixed-bottom" style={{"bottom":"1em"}}>
        <div className="container-fluid">
            <div id="reader" width="100%" />
            <nav class="navbar navbar-expand bg-light justify-content-between">
              <ul class="navbar-nav mx-auto text-center">
                  <li class="nav-item active">
                    <a class="nav-link" href="#">Store</a>
                  </li>
                  <li class="nav-item">
                    {toggleVisibility ? (
                        <React.Fragment>
                            <a class="nav-link" href="#"  onClick={() => {
                              handleClickAdvanced();
                            }}>Scan</a>
                        </React.Fragment>
                    ) : (
                        <a class="nav-link" href="#"   onClick={() => {
                          handleStop();
                          setToggleVisibility(!toggleVisibility);
                      }}>Stop</a>
                    )}
                    
                  </li>
                  <li class="nav-item">
                    <Link class="nav-link" to="/cart">Cart</Link>
                  </li>
                </ul>
            </nav>
        </div>
      </div>
    // <div style={{ position: "relative" }}>
    //   <div id="reader" width="100%" />
    // </div>
  );
};
export default Scanner;
