import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
    name: "configuration",
    initialState: {
        terminalId:null,
        posId:null,
        currency:null,
    },
    reducers:{
        act_saveConfig: (state, action) => {
            console.log(action.payload);
        },
    }
});

export const { act_saveConfig} = slice.actions;

export const saveConfig = (config) => async (dispatch,getState) => {
    dispatch(act_saveConfig(config));
  };

export default slice.reducer;