import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {kycOperationService} from "../services/kycOperation.service"
import kycOperationService from "../services/kycOperation.service";
import { setMessage } from "./message";



const initialState = { 
    rejected:{},
   
};

export const rejectKycOperation = createAsyncThunk(
    "rejectKycOperation/rejectKycOperation",
    async ( requestParam) => {
      try {
        const response = await kycOperationService.rejectKycOperation(requestParam)
        return response.data;
      } catch (error) {
        return error;
      }
    }
  );

  export const completeVerification = createAsyncThunk(
    "completeVerification/completeVerification",
    async ( requestParam,thunkAPI) => {
      try {
        const response = await kycOperationService.completeVerification(requestParam)
        thunkAPI.dispatch(setMessage(response.data.message));
        return response.data;
      } catch (error) {
        const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() || error.request.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message); 
        
        
      }
    }
  );

  export const completeVerificationRejectKyc = createAsyncThunk(
    "completeVerificationRejectKyc/completeVerificationRejectKyc",
    async ( requestParam) => {
      try {
        const response = await kycOperationService.completeVerificationRejectKyc(requestParam)
        return response.data;
      } catch (error) {
        return error;
      }
    }
  );



  export const kycOperationSlice = createSlice({
    name: "kycrejected",
    initialState,
    reducers: {},
     
    extraReducers: {
      [rejectKycOperation.pending]: (state, action) => {
        state.status = "pending";
        
      },
      [rejectKycOperation.fulfilled]: (state, action) => {
       

      },
      [rejectKycOperation.rejected]: (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      },
      // ------------------------------------ For Comments ---------------------


    //   [forSavingComments.pending]: (state, action) => {
    //     state.status = "pending";
        
    //   },
    //   [forSavingComments.fulfilled]: (state, action) => {
    //     // state.comments = action.payload

       

    //   },
    //   [riskCategory.rejected]: (state, action) => {
    //     forSavingComments = "failed";
    //     state.error = action.error.message;
    //   }, 
      
    
    }
  });
  export const {
   
  } = kycOperationSlice.actions;
  export const kycOperationReducer = kycOperationSlice.reducer;
  

  
  
  
  
  

  