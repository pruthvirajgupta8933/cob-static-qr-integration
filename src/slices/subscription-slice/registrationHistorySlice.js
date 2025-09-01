import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  debitTransactionReport,
  getAllMandateApi,
  getMandateRegistrationReport,
  transactionHistoryByuserApi,
} from "../../services/subscription-service/registrationHistory-service/registrationHistory.service";

const initialState = {};

export const registrationHistoryData = createAsyncThunk(
  "registrationHistoryData/registrationHistoryData",
  async (requestParam, thunkAPI) => {
    try {
      const data = await getAllMandateApi(requestParam);
      return data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.detail) ||
        error.message ||
        error.toString() ||
        error.request.toString();
      // thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const registrationHistoryReport = createAsyncThunk(
  "registrationHistoryData/registrationHistoryReport",
  async (requestParam, thunkAPI) => {
    try {
      const data = await getMandateRegistrationReport(requestParam);
      return data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.detail) ||
        error.message ||
        error.toString() ||
        error.request.toString();
      // thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const transactionHistoryByUser = createAsyncThunk(
  "transactionHistoryByUser/transactionHistoryByUser",
  async (object, thunkAPI) => {
    try {
      const data = await transactionHistoryByuserApi(object);
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() ||
        error.request.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const transactionReport = createAsyncThunk(
  "transactionHistoryByUser/transactionReport",
  async (object, thunkAPI) => {
    try {
      const data = await debitTransactionReport(object);
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() ||
        error.request.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

const registrationHisorySlice = createSlice({
  name: "registrationHistorySlice",
  initialState,
  extraReducers: (builder) => {},
});

export const registrationHisorySliceReducer = registrationHisorySlice.reducer;
