import React, { useState , useEffect} from "react";
import {Alert, Spinner, Button, Modal} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../app/cartSlice";

export const Catalog = () => {
    const cart = useSelector((state) => state.cart);
    const config = useSelector((state) => state.config);
    const [selectedItemId,setSelectedItemId] =  useState(null);
    const [selectedItemData,setSelectedItemData] = useState(null)
    const [showAddToCartDialog,setShowAddToCartDialog] = useState(false);
    const dispatch = useDispatch();

    const handleSelectedProduct = (data) => {
        setSelectedItemData(data);
        setSelectedItemId(data.id);
        setShowAddToCartDialog(true);
    }

    const handleCloseAddToCartDialog = () => {
        setSelectedItemData(null);
        setSelectedItemId(null);
        setShowAddToCartDialog(false);
    }

    const handleAddToCart = ()  => {
        handleCloseAddToCartDialog();
        dispatch(addToCart(selectedItemId));
    }

    return(
        <React.Fragment>
            {cart.products?.length > 0 ? (
                <ul class="products__list d-flex align-content-stretch flex-wrap">
                    {cart.products?.map((data, i) => (
                            <li className="products__list__list-item ">
                                <a className="products__list__list-item__item" onClick = {() => handleSelectedProduct(
                                    data
                                )}>
                                    <img src={data.image} alt="Polo shirt" className="lazyload-image lazyload-image--loaded products__list__list-item__item__image"/>
                                    <p className="products__list__list-item__item__title">{data.title}</p>
                                    <p className="products__list__list-item__item__price">
                                        {config.currency}
                                        {data.price.value/Math.pow(10,data.price.precision)}
                                    </p>
                                </a>
                            </li>
                        ))}
                </ul>
            ) : 
                <Alert variant='dark'>
                    No products configured.
                </Alert>
            }

            <Modal
                show = {showAddToCartDialog}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleCloseAddToCartDialog}
                >   
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body style={{
                        textAlign:"center",
                        }}>
                        {
                            (selectedItemData!==null)?
                                <React.Fragment>
                                    <h4>{selectedItemData.title}</h4>
                                    <img src={selectedItemData.image} alt="Polo shirt" class="lazyload-image lazyload-image--loaded products__list__list-item__item__image"/>
                                    <p class="products__list__list-item__item__price">
                                                {config.currency}
                                                {selectedItemData.price.value/Math.pow(10,selectedItemData.price.precision)}
                                    </p>
                                </React.Fragment>
                            :
                            ""
                        }
                       
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
                                variant="primary"
                                onClick={() => handleAddToCart()}>
                                    Add to Cart
                            </Button>
                        </div>
                    </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
};
