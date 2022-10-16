import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import configReducer from "./configSlice";

export default configureStore({
  reducer: {
    cart: cartReducer,
    config:configReducer
  }
});
