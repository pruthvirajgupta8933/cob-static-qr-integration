import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  updateContactInfoEditDetailsApi,
  updateBusinessOverViewDetailApi,
  updateMerchantInfoApi,
  updateSettlementInfoApi,
  uploadDocumentApi,
} from "../services/editKycForm/editKyc-service";
import { setMessage } from "./message";

const initialState = {
  postdata: {},
};

export const updateContactInfoEditDetails = createAsyncThunk(
  "editKycDetail/updateContactInfoEditDetails",
  async (requestParam, thunkAPI) => {
    try {
      const response = await updateContactInfoEditDetailsApi(requestParam);

      // thunkAPI.dispatch(setMessage(response.data.message));
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

export const updateBusinessOverViewEditDetails = createAsyncThunk(
  "editKycDetail/updateContactInfoEditDetails",
  async (requestParam, thunkAPI) => {
    try {
      const response = await updateBusinessOverViewDetailApi(requestParam);

      // thunkAPI.dispatch(setMessage(response.data.message));
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

export const updateMerchantInfo = createAsyncThunk(
  "editKycDetail/updateMerchantInfo",
  async (requestParam, thunkAPI) => {
    try {
      const response = await updateMerchantInfoApi(requestParam);

      // thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.detail) ||
        error.message ||
        error.toString() ||
        error.request.toString();

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateSettlementInfo = createAsyncThunk(
  "editKycDetail/updateSettlementInfo",
  async (requestParam, thunkAPI) => {
    try {
      const response = await updateSettlementInfoApi(requestParam);

      // thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.detail) ||
        error.message ||
        error.toString() ||
        error.request.toString();

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const uploadDocument = createAsyncThunk(
  "editKycDetail/uploadDocument",
  async (requestParam, thunkAPI) => {
    // console.log("requestParam",requestParam)

    try {
      const response = await uploadDocumentApi(requestParam);

      // thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() ||
        error.request.toString();
      console.log("message", message);

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const editKycDetailSlice = createSlice({
  name: "editKycDetail",
  initialState,
  reducers: {},

  extraReducers: {},
});

export const editKycDetailReducer = editKycDetailSlice.reducer;
