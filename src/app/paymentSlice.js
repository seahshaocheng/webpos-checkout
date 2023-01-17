import { createSlice } from "@reduxjs/toolkit";
import moment from 'moment';

export const slice = createSlice({
  name: "payment",
  initialState: {
    checkoutInitiated:false,
    error: "",
    sessionData: null,
    dropinInitiated:false,
    adyenenv:"TEST",
    region:"DEFAULT",
    checkoutVersion:"v68",
    countryCode:"SG",
    shopperReference:null,
    allowDefineRPM:false,
    allowSwitchEnv:true,
    availableRegions:[
      "DEFAULT","APSE","US","AU"
    ],
    availableCheckoutVersion:[
      "v69","v68","v67","v66","v65","v64","v53","v52","v51","v50","v49","v46","v41"
    ],
    reference: null,
    paymentMethodsRes:null,
    paymentRes:null,
    paymentDetailsRes:null,
    recurringChargeRes:null,
    paymentRequestData:{
        "merchantAccount": "PME_POS_SG",
        "amount": {
          "value": 10,
          "currency": "SGD"
        },
        "returnUrl": window.location.origin+"/redirect",
        "reference": "MarkDanielNewDemo_"+moment.utc().format("YYYYMMDDhhmmss"),
        "channel":"web",
        "shopperInteraction":"Ecommerce",
        "storePaymentMethod":false
      },
    subscriptionRequestData:{
      "merchantAccount": process.env.REACT_APP_MERCHANT_ACCOUNT,
      "amount": {
        "value": 6900,
        "currency": "SGD"
      },
      "paymentMethod":{
        "type":"scheme",
        "storedPaymentMethodId":"8416444173445612"
      },
      "reference": "MarkSubscriptionDemo1_"+moment.utc().format("YYYYMMDDhhmmss"),
      "shopperInteraction": "ContAuth",
      "recurringProcessingModel": "Subscription",
      "shopperReference":"MarkSubscriptionDemo",
      "returnUrl": window.location.origin+"/redirect",
      "countryCode": "SG",
      "channel":"web",
    },
    paymentDataStoreRes: null,
    config: {
      storePaymentMethod: true,
      paymentMethodsConfiguration: {
        ideal: {
          showImage: true,
        },
        card: {
          hasHolderName: true,
          holderNameRequired: true,
          name: "Credit or debit card"
        }
      },
      locale: "en-US",
      showPayButton: true,
      clientKey: process.env.REACT_APP_CLIENT_KEY,
      environment: "TEST",
    },
  },
  reducers: {
    paymentSession: (state, action) => {
      const [res, status] = action.payload;
      if (status >= 300) {
        state.error = res;
      } else {
        [state.session, state.orderRef] = res;
      }
    },
    paymentMethods:(state,action)=>{
        const [res, status] = action.payload;
      if (status >= 300) {
        state.error = res;
      } else {
        [state.paymentMethodsRes, state.orderRef] = res;
      }
    },
    payments: (state, action) => {
        const [res, status] = action.payload;
        if (status >= 300) {
          state.error = res;
        } else {
            console.log(JSON.stringify(res));
            [state.paymentRes, state.orderRef] = res;
        }
      },
    paymentDetails: (state, action) => {
        const [res, status] = action.payload;
        if (status >= 300) {
            state.error = res;
        } else {
            [state.paymentDetailsRes, state.orderRef] = res;
        }
    },
    recurringCharge: (state,action)=>{
      const [res, status] = action.payload;
        if (status >= 300) {
            state.error = res;
        } else {
            [state.recurringChargeRes, state.orderRef] = res;
        }
    },
    paymentDataStore: (state, action) => {
      const [res, status] = action.payload;
      if (status >= 300) {
        state.error = res;
      } else {
        state.paymentDataStoreRes = res;
      }
    },
    updatePaymentRequestData:(state,action)=>{
      state.paymentRequestData[action.payload.key] = action.payload.value;
    },
    updatePaymentAmount :(state,action)=>{
      state.paymentRequestData["amount"][action.payload.key] = action.payload.value;
    },
    updateCountryCode:(state,action)=>{
      state.countryCode = action.payload;
    },
    updateAdditionalData: (state,action) => {
      console.log(action.payload.value.length);
      if( state.paymentRequestData.additionalData===undefined){
          state.paymentRequestData.additionalData = {};
      }

      if(action.payload.value.length<=0){
        console.log("remove "+action.payload.key)
        delete state.paymentRequestData.additionalData[action.payload.key];
      }
      else{
        state.paymentRequestData.additionalData[action.payload.key]=action.payload.value;
      }
      console.log("additional",state.paymentRequestData.additionalData.length);
      if(Object.keys(state.paymentRequestData.additionalData).length===0){
        delete state.paymentRequestData['additionalData'];
      }
    },
    updateAdyenEnviornment:(state,action) => {
      console.log("Changing envionrment");
      console.log(action);
      state.adyenenv=action.payload;
      if(state.adyenenv === "LIVE"){
        state.config.clientKey=process.env.REACT_APP_CLIENT_KEY_PROD;
        state.config.environment = "LIVE"
       }
       else{
        state.config.clientKey=process.env.REACT_APP_CLIENT_KEY;
        state.config.environment = "TEST"
       }
    },
    updatePaymentMethodConfig: (state,action)=>{
      if(state.config.paymentMethodsConfiguration===undefined){
        state.config.paymentMethodsConfiguration={};
      }

      if(state.config.paymentMethodsConfiguration[action.payload.method]===undefined){
        state.config.paymentMethodsConfiguration[action.payload.method]={};
      }

      if(action.payload.isJSON){
        state.config.paymentMethodsConfiguration[action.payload.method][action.payload.fieldvalues.key]=JSON.parse(action.payload.fieldvalues.value);
      }
      else{
        state.config.paymentMethodsConfiguration[action.payload.method][action.payload.fieldvalues.key]=action.payload.fieldvalues.value;
      }
    },
    updateShopperReference: (state,action)=>{
      console.log("Changing ShopperStatement");
      console.log(action);
      if(action.payload!==null){
        state.shopperReference=action.payload;
        state.allowDefineRPM=true
      }
      else{
        console.log("DELETE")
        state.shopperReference=null;
        state.allowDefineRPM=false;
        delete state.paymentRequestData['shopperReference'];
      }
      
    },
    includeMetaData:(state,action) => {
      try{
        state.paymentRequestData["metadata"] = JSON.parse(action.payload);
      }
      catch(error){
        console.log("Non JSON in meta data");
      }
      
    },
    updateRegion:(state,action) => {
      state.region=action.payload;
      switch(state.region){
        case "APSE":
          state.config.environment = "live-apse";
        break;
        case "US":
          state.config.environment = "live-us";
        break;
        case "AU":
          state.config.environment = "live-au";
        break;
        default:
          state.config.environment = "LIVE";
      }
    },
    updateCheckoutVersion:(state,action) => {
      console.log("update version number to "+action.payload)
      state.checkoutVersion=action.payload;
    },
    updateCheckoutStatus:(state,action) => {
      console.log("update checkout state "+action.payload)
      state.checkoutInitiated=action.payload;
    }
  },
});

export const { paymentSession, paymentDataStore, updateAdditionalData, updatePaymentRequestData, paymentMethods,payments,paymentDetails,updateAdyenEnviornment,updateRegion,recurringCharge,updatePaymentMethodConfig,updateShopperReference,updatePaymentAmount,includeMetaData, updateCountryCode, updateCheckoutVersion,updateCheckoutStatus} = slice.actions;

export const initiateCheckout = (adyenenv,region) => async (dispatch,getState) => {
  console.log("initating");
  let server = process.env.REACT_APP_MERCHANT_SERVER_URL;

  const response = await fetch(`${server}/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify(getState().payment.paymentRequestData)
  });
  dispatch(paymentSession([await response.json(), response.status]));
};

export const getPaymentMethods = (adyenenv,region) => async (dispatch,getState) => {
  console.log("initating");
  let paymentMethodRequest = {
    "merchantAccount": process.env.REACT_APP_MERCHANT_ACCOUNT,
    "countryCode":getState().payment.countryCode
  };  

  if(getState().payment.shopperReference!==null){
    paymentMethodRequest.shopperReference = getState().payment.shopperReference
  }

  let checkoutVersion = getState().payment.checkoutVersion;

  const response = await fetch(`${process.env.REACT_APP_MERCHANT_SERVER_URL}/adyen/paymentMethods`, {
    method: "POST",
    headers: {
      "adyenenv":adyenenv,
      "region":region,
      "checkoutVersion":checkoutVersion,
      "Content-Type": "application/json",
    },
    body:JSON.stringify(paymentMethodRequest),
  });
  dispatch(paymentMethods([await response.json(), response.status]));
};

export const initiatePayment = (data,adyenenv,region) => async (dispatch,getState) => {
    console.log("submitting payment");
    let paymentRequestData  = getState().payment.paymentRequestData
    let requestdata = {
        ...paymentRequestData,
        ...data
    }
    console.log(requestdata);
    const response = await fetch(`${process.env.REACT_APP_MERCHANT_SERVER_URL}/adyen/payments`, {
        method: "POST",
        headers: {
          "adyenenv":adyenenv,
          "region":region,
          "checkoutVersion":getState().payment.checkoutVersion,
          "Content-Type": "application/json",
        },
        body:JSON.stringify(requestdata)
      });
    dispatch(payments([await response.json(), response.status]));
}

export const submitAdditionalDetails = (data,adyenenv,region) => async (dispatch,getState) => {
    const response = await fetch(`${process.env.REACT_APP_MERCHANT_SERVER_URL}/adyen/payments/details`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "adyenenv":adyenenv,
        "region":region,
        "checkoutVersion":getState().payment.checkoutVersion,
        "Content-Type": "application/json",
      },
    });
    dispatch(paymentDetails([await response.json(), response.status]));
  };

export const submitRecurringCharge = (data,adyenenv,region) => async (dispatch,getState) => {
  const response = await fetch(`${process.env.REACT_APP_MERCHANT_SERVER_URL}/adyen/payments`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "adyenenv":adyenenv,
      "region":region,
      "checkoutVersion":getState().payment.checkoutVersion,
      "Content-Type": "application/json",
    },
  });
  dispatch(recurringCharge([await response.json(), response.status]));
}

export const getPaymentDataStore = () => async (dispatch) => {
  const response = await fetch("/api/getPaymentDataStore");
  dispatch(paymentDataStore([await response.json(), response.status]));
};

export default slice.reducer;
