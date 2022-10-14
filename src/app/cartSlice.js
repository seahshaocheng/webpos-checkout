import { createSlice } from "@reduxjs/toolkit";
import products from "../data/product";

export const slice = createSlice({
    name: "cart",
    initialState: {
        cart:[],
        total:0,
        totalPrecision:2,
        products
    },
    reducers:{
        act_addToCart: (state, action) => {
            console.log(action.payload);
            const id = action.payload;
            let scannedProduct = products.find(product=> product.id === id);
            let existingProduct = state.cart.find(product=>product.id === id);
            console.log("foundProduct",existingProduct);
            if(existingProduct!==undefined){
                console.log("found");
                existingProduct.qty +=1;
                existingProduct.gross=existingProduct.price.value*existingProduct.qty;
            }
            else{
                let newProductAdded = scannedProduct;
                console.log("scannedProduct",scannedProduct);
                newProductAdded = {
                    ...newProductAdded,
                    qty:1,
                    gross:scannedProduct.price.value
                }
                state.cart = [...state.cart,newProductAdded];
            }
            state.total+=scannedProduct.price.value;
            state.totalPrecision=scannedProduct.price.precision;
        },
        act_removeFromCart:(state, action) => {
           //
        },
        act_clearCart:(state,action) => {
            //
        }
    }
});

export const { act_addToCart,act_removeFromCart,act_clearCart} = slice.actions;

export const addToCart = (id) => async (dispatch,getState) => {
    dispatch(act_addToCart(id));
  };

export default slice.reducer;