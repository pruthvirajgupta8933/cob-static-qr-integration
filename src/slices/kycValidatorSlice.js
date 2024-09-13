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


export const aadhaarNumberVerification = createAsyncThunk(
  "kycValidator/aadhaarNumberVerification",
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
      thunkAPI.dispatch(setMessage({ message }));
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
      .addCase(aadhaarNumberVerification.pending, (state, action) => {
        state.aadharOtpResponse = {}
      })
      .addCase(aadhaarNumberVerification.fulfilled, (state, action) => {
        state.aadharOtpResponse = action.payload
      })
      .addCase(aadhaarNumberVerification.rejected, (state, action) => {

        state.aadharOtpResponse = {
          message: action?.payload,
          status: false
        }
      })
  }
});


export const kycValidatorReducer = kycValidatorSlice.reducer;








