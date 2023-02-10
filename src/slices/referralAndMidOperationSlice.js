import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import referralAndMidService from "../services/referralAndMid.service";



const initialState = { 
   
};

  
export const saveReferingMerchant = createAsyncThunk(
    "saveReferingMerchant/saveReferingMerchant",
    async ( requestParam, thunkAPI) => {
      try {
        const response = await referralAndMidService.saveReferingMerchant(requestParam)
        return response.data;
      } catch (error) {
        const message =
        (error.response &&
          error.response.data &&
          error.response.data.detail) ||
        error.message ||
        error.toString() || error.request.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message); 
        
        
      }
    }
  );


  export const forGeneratingMid = createAsyncThunk(
    "saveReferingMerchant/saveReferingMerchant",
    async ( requestParam, thunkAPI) => {
      try {
        const response = await referralAndMidService.forGeneratingMid(requestParam)
        return response.data;
      } catch (error) {
        const message =
        (error.response &&
          error.response.data &&
          error.response.data.detail) ||
        error.message ||
        error.toString() || error.request.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message); 
        
        
      }
    }
  );


 



  export const referralAndMidOperationSlice = createSlice({
    name: "referralandMid",
    initialState,
    reducers: {},
     
    extraReducers: {
    
      // ------------------------------------ For Comments ---------------------



    
    }
  });
  export const {
   
  } = referralAndMidOperationSlice.actions;
  export const ReferralMidReducer = referralAndMidOperationSlice.reducer;
  

  
  
  
  
  

  