import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import {
  cinDetail,
  aadharNumberVerify,
  aadharOtpVerify,
} from "../services/kyc-validator-service/kycValidator.service";
import { kycValidatorAuth } from "../utilities/axiosInstance";
import API_URL from "../config";

const initialState = {};

//----- GST,PAN,ACCOUNT NO, AADHAAR,IFSC) KYC VALIDATTE ------//
export const panValidation = createAsyncThunk(
  "kyc/panValidation",
  async (requestParam) => {
    // console.log("check 1",requestParam)
    const response = await kycValidatorAuth
      .post(`${API_URL.VALIDATE_KYC}/validate-pan/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const authPanValidationrr = createAsyncThunk(
  "kyc/authPanValidationrr",
  async (requestParam) => {
    // console.log("check 4")
    const response = await kycValidatorAuth
      .post(`${API_URL.VALIDATE_KYC}/validate-pan/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const authPanValidation = createAsyncThunk(
  "kyc/authPanValidation",
  async (requestParam) => {
    const response = await kycValidatorAuth
      .post(`${API_URL.VALIDATE_KYC}/validate-pan/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const gstValidation = createAsyncThunk(
  "kyc/gstValidation",
  async (requestParam) => {
    const response = await kycValidatorAuth
      .post(`${API_URL.VALIDATE_KYC}/validate-gst/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const udyamRegistration = createAsyncThunk(
  "kyc/gstValidation",
  async (requestParam) => {
    const response = await kycValidatorAuth
      .post(`${API_URL.UDYAM_REGISTRATION}/validate-udyam/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const ifscValidation = createAsyncThunk(
  "kyc/ifscValidation",
  async (requestParam) => {
    const response = await kycValidatorAuth
      .post(`${API_URL.VALIDATE_KYC}/validate-ifsc/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const bankAccountVerification = createAsyncThunk(
  "kyc/bankAccountVerification",
  async (requestParam) => {
    const response = await kycValidatorAuth
      .post(`${API_URL.VALIDATE_KYC}/validate-account/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const credReportValidation = createAsyncThunk(
  "kyc/credReportValidation",
  async (requestParam) => {
    const response = await kycValidatorAuth
      .post(`${API_URL.VALIDATE_KYC}/validate-cred-report/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const voterCardValidation = createAsyncThunk(
  "kyc/voterCardValidation",
  async (requestParam) => {
    const response = await kycValidatorAuth
      .post(`${API_URL.VALIDATE_KYC}/validate-voter-card/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const dlValidation = createAsyncThunk(
  "kyc/drivingLicenseValidation",
  async (requestParam) => {
    const response = await kycValidatorAuth
      .post(`${API_URL.VALIDATE_KYC}/validate-driving-liscence/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
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
