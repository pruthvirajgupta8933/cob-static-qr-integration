import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import referralAndMidService from "../services/referralAndMid.service";
import { axiosInstanceJWT } from "../utilities/axiosInstance";
import API_URL from "../config";



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
          error.response.data.message) ||
        error.message ||
        error.toString() || error.request.toString();
      thunkAPI.dispatch(setMessage(message));
      console.log("this is message",message)
      return thunkAPI.rejectWithValue(message); 
        
        
      }
    }
  );

 
  export const getallGenrateMidData = createAsyncThunk(
    "saveReferingMerchant/saveReferingMerchant",
    async ( requestParam, thunkAPI) => {
      const clientCode=requestParam.clientCode

try {
        // const response = await referralAndMidService.forGeneratingMid(requestParam)
        const response = await axiosInstanceJWT.get(`${API_URL.GET_ALL_GENERATE_MID_DATA}?clientCode=${clientCode}&order_by=-id`)
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
  

  
  
  
  
  

  