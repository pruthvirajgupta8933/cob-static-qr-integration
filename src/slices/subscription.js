import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import subscriptionService from "../services/manualSubscription";
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

export const getSubscriptionPlans = createAsyncThunk(
  "subscription/getManualSubscriptions",
  async (object = {}, thunkAPI) => {
    try {
      const data = await subscriptionService.getSubscriptions();
      return data;
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
export const getSubscriptionPlanById = createAsyncThunk(
  "subscription/getManualSubscriptionById",
  async (requestParam, thunkAPI) => {
    try {
      const data = await subscriptionService.getSubscriptionById(
        requestParam.id
      );
      return data;
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

export const getSubscriptionPlanByClientCode = createAsyncThunk(
  "subscription/getManualSubscriptionByClientCode",
  async (requestParam, thunkAPI) => {
    try {
      const data = await subscriptionService.getSubscriptionByClientCode(
        requestParam.clientCode
      );
      return data;
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
export const createSubscriptionPlan = createAsyncThunk(
  "subscription/createManualSubscriptions",
  async (requestParam, thunkAPI) => {
    try {
      const res = await subscriptionService.createSubscription(requestParam);
      return res.data;
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
export const updateSubscriptionPlan = createAsyncThunk(
  "subscription/updateManualSubscriptions",
  async (id, requestParam, thunkAPI) => {
    try {
      const data = await subscriptionService.updateSubscription(
        id,
        requestParam
      );
      return data;
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
export const deleteSubscriptionPlan = createAsyncThunk(
  "subscription/deleteManualSubscription",
  async (requestParam, thunkAPI) => {
    try {
      const data = await subscriptionService.deleteSubscription(
        requestParam.id
      );
      return data;
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
const initialState = {
  subscriptionServiceResponse: {},
  subscriptionPackageResponse: {},
  isLoading: false,
  manualSubscriptions: null,
  merchantSubscriptionList: [],
};
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
    [getSubscriptionPlanByClientCode.pending]: (state) => {
      state.manualSubscriptions = { loading: true };
    },
    [getSubscriptionPlanByClientCode.fulfilled]: (state, action) => {
      state.manualSubscriptions = action.payload.data;
    },
    [getSubscriptionPlanByClientCode.rejected]: (state) => {
      state.manualSubscriptions = { error: true };
    },
  },
});

export const { reducer: reducerSubscription } = subscriptionSlice;
