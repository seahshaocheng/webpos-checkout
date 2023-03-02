import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
    name: "configuration",
    initialState: {
        store:null,
        terminalId:null,
        posId:null,
        currency:null,
        customerLoyalty:null,
        mockLoyalty:null,
        selfieCCreceipt:null,
        selfieCCreceiptName:null,
        selfieCCpersonTitle:null,
        selfieCCpersonContact:null
    },
    reducers:{
        act_saveConfig: (state, action) => {
            console.log(action.payload);
            state.store=action.payload.store;
            state.terminalId=action.payload.terminalId;
            state.posId=action.payload.posId;
            state.currency=action.payload.currency;
            state.customerLoyalty=action.payload.customerLoyalty;
            state.mockLoyalty=action.payload.mockLoyalty;
            state.useEcomm = action.payload.useEcomm
            state.selfieCCreceipt=action.payload.selfieCCreceipt
            state.selfieCCreceiptName=action.payload.selfieCCreceiptName
            state.selfieCCpersonTitle=action.payload.selfieCCpersonTitle
            state.selfieCCpersonContact=action.payload.selfieCCpersonContact
        },
    }
});

export const { act_saveConfig} = slice.actions;

export const saveConfig = (config) => async (dispatch,getState) => {
    dispatch(act_saveConfig(config));
  };

export default slice.reducer;
