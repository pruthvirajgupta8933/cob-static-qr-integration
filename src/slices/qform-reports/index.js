import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { QformService } from "../../services/qform-reports";

const initialState = {
  qFormList: {
    result: [],
    loading: false,
    failure: false,
  },
};

export const getQformList = createAsyncThunk(
  "getQwickFormList",
  async (requestParam, thunkAPI) => {
    try {
      const response = await QformService.getListOfForms(requestParam);
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

export const getQformTxnList = createAsyncThunk(
  "getQwickFormTxnList",
  async (requestParam, thunkAPI) => {
    try {
      const response = await QformService.getTxnReports(requestParam);
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

export const qFormSlice = createSlice({
  name: "qFormSlice",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getQformList.pending, (state) => {
        state.qFormList.loading = true;
      })
      .addCase(getQformList.fulfilled, (state, action) => {
        state.qFormList.result = action.payload;
        state.qFormList.loading = false;
      })
      .addCase(getQformList.rejected, (state) => {
        state.qFormList.failure = true;
        state.qFormList.loading = false;
      });
  },
});

export const qFormSliceReducer = qFormSlice.reducer;
