import Scanner from "../components/scanner";
import {Alert} from "react-bootstrap";
import React, { useState , useEffect} from "react";
import products from "../data/product";

export const EndlessAisle = () => {
  const [decodedText, setDecodedText] = useState([]);
  const [html5QrCode, sethtml5QrCode] = useState({});

  function handleQuickResponse(data) {
    //setDecodedText((prevState) => [...prevState, data]);
    //use decodeText as the cart
    let scannedProduct = products.find(product=> product.id === data.result.text);

    if(scannedProduct!==undefined){
        console.log("the cart",decodedText);
        let existingProduct = decodedText.find(product=>product.id === data.result.text);
        console.log("foundProduct",existingProduct);
        if(existingProduct!==undefined){
            console.log("found");
            let newCartState = decodedText.map((addedProduct,i)=>{
                if(addedProduct.id===data.result.text){
                    addedProduct.qty+=1;
                    addedProduct.gross=addedProduct.price.value*addedProduct.qty
                    return addedProduct;
                }
            });
            setDecodedText(newCartState);
        }
        else{
            let newProductAdded = scannedProduct;
            newProductAdded['qty']=1;
            newProductAdded['gross']=scannedProduct.price.value*newProductAdded['qty'];
            setDecodedText((prevState) => [...prevState, newProductAdded]);
        }
    }
    else{
        //Show no product found error.
    }
  }

  return (
    <React.Fragment>
        {decodedText.length > 0 ? (
            <div>
                <table className="table" style={{"maxheight":"50vh","overflow":"auto"}}>
                    <thead>
                        <tr>
                        <th scope="col">Product Name</th>
                        <th scope="col">Qty</th>
                        <th scope="col">Unit Price</th>
                        <th scope="col">Unit Total</th>
                        </tr>
                    </thead>
                    {decodedText.map((data, i) => (
                        <tbody key={i}>
                        <tr>
                            <td>{data.title}<br/><small class="text-muted">{data.id}</small></td>
                            <td>{data.qty}</td>
                            <td>{data.price.value/Math.pow(10,data.price.precision)}</td>
                            <td>{data.gross/Math.pow(10,data.price.precision)}</td>
                        </tr>
                        </tbody>
                    ))}
                    </table>
            </div>
      ) : 
        <Alert variant='dark'>
            No product in cart, start scanning
        </Alert>
      }
    <Scanner
        handleQuickResponse={handleQuickResponse}
        sethtml5QrCode={sethtml5QrCode}
        html5QrCode={html5QrCode}
      ></Scanner>
    </React.Fragment>
  );
}