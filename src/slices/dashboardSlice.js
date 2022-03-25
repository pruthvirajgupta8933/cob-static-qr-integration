import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import {Dashboardservice} from "../services/dashboard.service";
import profileService from "../services/profile.service";


const initialState = { 
  successTxnsumry:[], 
  isLoading:false, 
  subscribedService: [], 
  subscriptionplandetail: [],
  transactionHistory:[],
  isLoadingTxnHistory:false

};


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

  export const saveSubscribedPlan = createAsyncThunk("dashbaord/saveSubscribedPlan", async (data) => {
    console.log("data",data);    
    console.log("data");    
    
  });

  export const fetchTransactionHistorySlice = createAsyncThunk(
    "dashbaord/transactionHistory",
    async (data, thunkAPI) => {
      try {
        const response = await Dashboardservice.fetchTransactionHistory(data);
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
      [fetchTransactionHistorySlice.fulfilled]: (state, action) => {
        state.isLoadingTxnHistory = false;
        state.transactionHistory = action.payload;
      },
      [fetchTransactionHistorySlice.pending]: (state) => {
        state.isLoadingTxnHistory = true;
        state.transactionHistory=[];
      },
      [fetchTransactionHistorySlice.rejected]: (state) => {
        state.isLoadingTxnHistory = false;
        state.transactionHistory=[];
      },

      
      },
  })
  
  export const dashboardReducer = dashboardSlice.reducer