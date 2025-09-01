/* eslint-disable no-empty-pattern */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import kycOperationService from "../services/kycOperation.service";
import { setMessage } from "./message";



const initialState = {
  rejected: {},

};

export const rejectKycOperation = createAsyncThunk(
  "rejectKycOperation/rejectKycOperation",
  async (requestParam, thunkAPI) => {
    try {
      const response = await kycOperationService.rejectKycOperation(requestParam)
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

export const completeVerification = createAsyncThunk(
  "completeVerification/completeVerification",
  async (requestParam, thunkAPI) => {
    try {
      const response = await kycOperationService.completeVerification(requestParam)
      thunkAPI.dispatch(setMessage(response.data.message));
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

export const completeVerificationRejectKyc = createAsyncThunk(
  "completeVerificationRejectKyc/completeVerificationRejectKyc",
  async (requestParam, thunkAPI) => {
    try {
      const response = await kycOperationService.completeVerificationRejectKyc(requestParam)
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

////////////////////////////// for reverse to pending
// export const reverseToPendingVerification = createAsyncThunk(
//   "reverseToPendingVerification/reverseToPendingVerification",
//   async (requestParam, thunkAPI) => {
//     try {
//       const response = await kycOperationService.reverseToPendingVerification(requestParam)
//       return response.data;
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.detail) ||
//         error.message ||
//         error.toString() || error.request.toString();
//       thunkAPI.dispatch(setMessage(message));
//       return thunkAPI.rejectWithValue(message);


//     }
//   }
// );


// export const reverseToPendingApproval = createAsyncThunk(
//   "reverseToPendingApproval/reverseToPendingApproval",
//   async ( requestParam, thunkAPI) => {
//     try {
//       const response = await kycOperationService.reverseToPendingApproval(requestParam)
//       return response.data;
//     } catch (error) {
//       const message =
//       (error.response &&
//         error.response.data &&
//         error.response.data.detail) ||
//       error.message ||
//       error.toString() || error.request.toString();
//     thunkAPI.dispatch(setMessage(message));
//     return thunkAPI.rejectWithValue(message); 


//     }
//   }
// );

// export const reverseToPendingkyc = createAsyncThunk(
//   " reverseToPendingkyc/reverseToPendingkyc",
//   async ( requestParam, thunkAPI) => {
//     try {
//       const response = await kycOperationService.reverseToPendingkyc(requestParam)
//       return response.data;
//     } catch (error) {
//       const message =
//       (error.response &&
//         error.response.data &&
//         error.response.data.detail) ||
//       error.message ||
//       error.toString() || error.request.toString();
//     thunkAPI.dispatch(setMessage(message));
//     return thunkAPI.rejectWithValue(message); 


//     }
//   }
// );



export const kycOperationSlice = createSlice({
  name: "kycrejected",
  initialState,
  reducers: {},

  extraReducers: (builder)=>{
    builder
    .addCase(rejectKycOperation.pending,(state)=>{
      state.status = "pending";
    })

    .addCase(rejectKycOperation.fulfilled,(state)=>{

    })
    .addCase(rejectKycOperation.rejected,(state,action)=>{
      state.status = "failed";
      state.error = action.error.message;

    })
    
    


  }
});
export const {

} =
  kycOperationSlice.actions;
export const kycOperationReducer = kycOperationSlice.reducer;








