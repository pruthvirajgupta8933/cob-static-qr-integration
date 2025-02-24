import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import paymentLinkService from "../../services/create-payment-link/paymentLink.service";

const initialState = {
  getPayerDetails: {
    result: [],
    count: 0,
  },
  dashboardData: {},
  txnTableData: [],
};

export const getPayerApi = createAsyncThunk(
  "getPayerApi",
  async (requestParam, thunkAPI) => {
    try {
      const response = await paymentLinkService.getPayer(requestParam);
      return response.data;
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

export const getPayMentLink = createAsyncThunk(
  "getPayMentLink",
  async (requestParam, thunkAPI) => {
    try {
      const response = await paymentLinkService.getPaymentLink(requestParam);
      return response.data;
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

export const getDashboardData = createAsyncThunk(
  "getDashboardData",
  async (requestParam, thunkAPI) => {
    try {
      const response = await paymentLinkService.getDashboardData(requestParam);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.detail) ||
        error.message ||
        error.toString() ||
        error.request.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTxnGraphData = createAsyncThunk(
  "getTxnGraphData",
  async (requestParam, thunkAPI) => {
    try {
      const response = await paymentLinkService.getTxnGraphData(requestParam);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.detail) ||
        error.message ||
        error.toString() ||
        error.request.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTxnData = createAsyncThunk(
  "getTxnData",
  async (requestParam, thunkAPI) => {
    try {
      const response = await paymentLinkService.getTxnTableData(requestParam);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.detail) ||
        error.message ||
        error.toString() ||
        error.request.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const paymentLinkSlice = createSlice({
  name: "paymentLinkSlice",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getPayerApi.pending, (state) => {
        // state.infoBulletin = { loading: true };
      })
      .addCase(getPayerApi.fulfilled, (state, action) => {
        state.getPayerDetails = action.payload;
      })
      .addCase(getPayerApi.rejected, (state) => {
        // state.infoBulletin = { error: true };
      })
      .addCase(getDashboardData.pending, (state, action) => {
        state.dashboardData[
          `${action.meta.arg.start_date}-${action.meta.arg.end_date}`
        ] = { loading: true };
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.dashboardData[
          `${action.meta.arg.start_date}-${action.meta.arg.end_date}`
        ] = action.payload;
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.dashboardData[
          `${action.meta.arg.start_date}-${action.meta.arg.end_date}`
        ] = { error: true };
      })
      .addCase(getTxnData.fulfilled, (state, action) => {
        state.txnTableData = action.payload;
      });
  },
});

export const paymentLinkSliceReducer = paymentLinkSlice.reducer;
