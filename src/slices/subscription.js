import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import subscriptionService from "../services/subscription";

// const user = JSON.parse(localStorage.getItem("user"));



export const subscriptionplan = createAsyncThunk(
  "subscription/subscriptionplan",
  async (object = {}, thunkAPI) => {
    try {
      const data = await subscriptionService.subscriptionPlan();
      return { subscribe: data };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const subscriptionPlanDetail = createAsyncThunk(
  "subscription/subscriptionChargesDetail",
  async (object = {}, thunkAPI) => {
    try {
      const data = await subscriptionService.subscriptionChargesDetail();
      return { subscriptionplandetail: data };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);



const initialState = { subscriptionServiceResponse: {}, subscriptionPackageResponse: {}, isLoading: false }
const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  extraReducers: {
    [subscriptionplan.pending]: (state, action) => {
      state.isLoading = true;
    },
    [subscriptionplan.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.subscription = action.payload.data;
    },
    [subscriptionplan.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

export default subscriptionSlice;
