import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import {Dashboardservice} from "../services/dashboard.service";

const initialState = { successTxnsumry:[], isLoading:false, subscribedService: [], subscriptionplandetail: [] };

export const successTxnSummary = createAsyncThunk(
    "dashbaord/successTxnSummary",
    async (object, thunkAPI ) => {
        try {
            // console.log(object);
            const {fromDate,toDate,clientCode} = object;
            const response = await Dashboardservice.successTxnSummary(fromDate,toDate,clientCode );
            //thunkAPI.dispatch(setMessage(response.data.message));
            // console.log('slice',response)
            return response;
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

  export const subscriptionplan = createAsyncThunk(
    "dashbaord/subscriptionplan",
    async ({}, thunkAPI) => {
      try {
        const response = await Dashboardservice.subscriptionplan();
        console.log("subscribe data", response );
        return response;
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
    "dashbaord/subscriptionPlanDetail",
    async ({}, thunkAPI) => {
      try {
        const response = await Dashboardservice.subscriptionPlanDetail();
        return response;
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

  export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    extraReducers: {
      [successTxnSummary.pending]: (state) => {
        state.isLoading = true
      },
      [successTxnSummary.fulfilled]: (state, action) => {
        //console.log('action-payload',action)
        state.isLoading = false
        state.successTxnsumry = action.payload
      },
      [successTxnSummary.rejected]: (state) => {
        state.isLoading = false
      },
      [subscriptionplan.pending]: (state) => {
        state.isLoading = true;
      },
      [subscriptionplan.fulfilled]: (state, action) => {
        state.isLoading = false;
        state.subscribedService = action.payload.data;
      },
      [subscriptionplan.rejected]: (state) => {
        state.isLoading = false;
      },
      },
  })
  
  export const dashboardReducer = dashboardSlice.reducer