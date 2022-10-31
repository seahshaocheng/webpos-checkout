import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer,persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import cartReducer from "./cartSlice";
import configReducer from "./configSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
  config:configReducer
});

const persistConfig = {
  key : 'root',
  version:1,
  storage,
  blacklist:['cart']
}

const persistedReducer = persistReducer(persistConfig,rootReducer);

export const store =   configureStore({
  reducer: persistedReducer,
  middleware:[thunk]
});

export const persistor = persistStore(store);
