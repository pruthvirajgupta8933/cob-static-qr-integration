import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import {
  cinDetail,
  aadharNumberVerify,
  panVerify,
  gstVerify,
  udyamVerify,
  ifscVerify,
  accountVerify,
  credReportVerify,
  cinVerify,
  voterVerify,
  dlVerify,
} from "../services/kyc-validator-service/kycValidator.service";

const initialState = {};

//----- GST,PAN,ACCOUNT NO, AADHAAR,IFSC) KYC VALIDATTE ------//
export const panValidation = createAsyncThunk(
  "kyc/panValidation",
  async (requestParam, thunkAPI) => {
    // console.log("check 1",requestParam)
    try {
      const response = await panVerify(requestParam);

      return response.data;
    } catch (error) {
      return error.response;
    }
  }
);

export const authPanValidation = createAsyncThunk(
  "kyc/authPanValidation",
  async (requestParam, thunkAPI) => {
    try {
      const response = await panVerify(requestParam);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() ||
        error.request.toString();
      thunkAPI.dispatch(setMessage(message));
      console.log("message", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const gstValidation = createAsyncThunk(
  "kyc/gstValidation",
  async (requestParam, thunkAPI) => {
    try {
      const response = await gstVerify(requestParam);

      return response.data;
    } catch (error) {
      return error.response;
    }
  }
);

export const udyamRegistration = createAsyncThunk(
  "kyc/udyamValidation",
  async (requestParam, thunkAPI) => {
    try {
      const response = await udyamVerify(requestParam);

      return response.data;
    } catch (error) {
      return error.response;
    }
  }
);

export const ifscValidation = createAsyncThunk(
  "kyc/ifscValidation",
  async (requestParam, thunkAPI) => {
    try {
      const response = await ifscVerify(requestParam);

      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() ||
        error.request.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const bankAccountVerification = createAsyncThunk(
  "kyc/bankAccountVerification",
  async (requestParam, thunkAPI) => {
    try {
      const response = await accountVerify(requestParam);

      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() ||
        error.request.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const credReportValidation = createAsyncThunk(
  "kyc/credReportValidation",
  async (requestParam) => {
    try {
      const response = await credReportVerify(requestParam);

      return response.data;
    } catch (error) {
      return error.response;
    }
  }
);

export const voterCardValidation = createAsyncThunk(
  "kyc/voterCardValidation",
  async (requestParam, thunkAPI) => {
    try {
      const response = await voterVerify(requestParam);

      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() ||
        error.request.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const dlValidation = createAsyncThunk(
  "kyc/drivingLicenseValidation",
  async (requestParam, thunkAPI) => {
    try {
      const response = await dlVerify(requestParam);

      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() ||
        error.request.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cinLookupApi = createAsyncThunk(
  "kycValidator/cinLookupApi",
  async (requestParam, thunkAPI) => {
    try {
      const response = await cinDetail(requestParam);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() ||
        error.request.toString();
      thunkAPI.dispatch(setMessage(message));
      console.log("message", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cinValidation = createAsyncThunk(
  "kyc/cinValidation",
  async (requestParam) => {
    try {
      const response = await cinVerify(requestParam);

      return response.data;
    } catch (error) {
      return error.response;
    }
  }
);

export const aadhaarNumberVerification = createAsyncThunk(
  "kycValidator/aadhaarNumberVerification",
  async (requestParam, thunkAPI) => {
    try {
      const response = await aadharNumberVerify(requestParam);
      // console.log(response)
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() ||
        error.request.toString();
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
        state.aadharOtpResponse = {};
      })
      .addCase(aadhaarNumberVerification.fulfilled, (state, action) => {
        state.aadharOtpResponse = action.payload;
      })
      .addCase(aadhaarNumberVerification.rejected, (state, action) => {
        state.aadharOtpResponse = {
          message: action?.payload,
          status: false,
        };
      });
  },
});

export const kycValidatorReducer = kycValidatorSlice.reducer;
