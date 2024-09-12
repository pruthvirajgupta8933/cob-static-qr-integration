import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import { cinDetail, aadharNumberVerify, aadharOtpVerify } from "../services/kyc-validator-service/kycValidator.service";




const initialState = {

};


export const cinLookupApi = createAsyncThunk(
  "kycValidator/cinLookupApi",
  async (requestParam, thunkAPI) => {
    try {
      const response = await cinDetail(requestParam)
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() || error.request.toString();
      thunkAPI.dispatch(setMessage(message));
      console.log("message", message)
      return thunkAPI.rejectWithValue(message);


    }
  }
);


export const aadharNumberVerification = createAsyncThunk(
  "kycValidator/aadharNumberVerification",
  async (requestParam, thunkAPI) => {
    try {
      const response = await aadharNumberVerify(requestParam)
      // console.log(response)
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() || error.request.toString();
      thunkAPI.dispatch(setMessage(message));
      // console.log("message", message)
      return thunkAPI.rejectWithValue(message);


    }
  }
);

export const kycValidatorSlice = createSlice({
  name: "kycValidator",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(aadharNumberVerification.pending, (state, action) => {
        state.aadharOtpResponse = {}
      })
      .addCase(aadharNumberVerification.fulfilled, (state, action) => {
        console.log(action.payload)
        state.aadharOtpResponse = action.payload
      })
      .addCase(aadharNumberVerification.rejected, (state, action) => {
        state.aadharOtpResponse = {}
      })
  }
});


export const kycValidatorReducer = kycValidatorSlice.reducer;








