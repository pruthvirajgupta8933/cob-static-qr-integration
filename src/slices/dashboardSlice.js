import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import {Dashboardservice} from "../services/dashboard.service";
import ProfileService from "../services/profile.service";

const initialState = { successTxnsumry:[], isLoading:false, subscribedService: [], subscriptionplandetail: [], createClientProfile:[] };



/* ======Start Profile Function ======= */


export const createClientProfile = createAsyncThunk(
  "dashboard/createClientProfile",
  async (object, thunkAPI) => {
    try {
      // console.log({ fromdate, todate, clientcode });
      const response = await ProfileService.createClintCode(object );
      thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
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



/* ======End Profile Function ======= */


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
      [createClientProfile.pending]:(state)=>{
        state.createClientProfile = {}
      },
      [createClientProfile.fulfilled]:(state,action)=>{
        state.createClientProfile = action.payload

      },
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