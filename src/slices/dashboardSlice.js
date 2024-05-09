import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import {Dashboardservice} from "../services/dashboard.service";


const initialState = { 
  successTxnsumry:[], 
  isLoading:false, 
  subscribedService: [], 
  subscriptionplandetail: [],
  transactionHistory:[],
  settlementReport:[],
  chargebackTxnHistory:[],
  refundTransactionHistory:[],
  isLoadingTxnHistory:false,
  productSubscribe : true,
  isExportData:false,
  txnChartData:[]
};


export const successTxnSummary = createAsyncThunk(
    "dashbaord/successTxnSummary",
    async (object, thunkAPI ) => {
        try {
            const response = await Dashboardservice.successTxnSummary(object);
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


export const txnChartDataSlice = createAsyncThunk(
    "dashbaord/txnChartDataSlice",
    async (obj, thunkAPI ) => {
        try {
            const response = await Dashboardservice.getTxnDataForGraph(obj);
            return response?.data;
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
    async (object = {}, thunkAPI) => {
      try {
        const response = await Dashboardservice.subscriptionplan();
        
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
    async (object = {}, thunkAPI) => {
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

  ////////////////////////////////////////////
  

  
  //////////////////////////////////////

  


  export const fetchSettlementReportSlice = createAsyncThunk(
    "dashbaord/fetchSettlementReport",
    async (data, thunkAPI) => {
      try {
        const response = await Dashboardservice.settlementReport(data);
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

  //////////////////////////////////////////////////////////
  export const fetchRefundTransactionHistory = createAsyncThunk(
    "dashbaord/GetRefundTxnHistory",
    async (data, thunkAPI) => {
      try {
        // console.log("check1",data)
        const response = await Dashboardservice.refundTransactionHistory(data);
        return response.data;
      } catch (error) {
        // console.log("check2",error.response)
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

  ////////////////////////////////////////////////////////////// chargebackslice
  export const fetchChargebackTxnHistory = createAsyncThunk(
    "dashbaord/GetChargebackTxnHistory",
    async (data, thunkAPI) => {
      try {
        // console.log("check1",data)
        const response = await Dashboardservice.chargebackTxnHistory(data);
        return response.data;
      } catch (error) {
        // console.log("check2",error.response)
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


  /////////////////////////////////////////////////////////////////////




  export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers:{
      clearTransactionHistory : (state)=>{
        state.transactionHistory = []
      },
      clearSuccessTxnsummary : (state)=>{
        state.successTxnsumry = []
      },
      clearSettlementReport : (state)=>{
        state.settlementReport=[]
      },
      productSubscribeState : (state,action)=>{

          state.productSubscribe = action.payload;
      },
      exportTxnLoadingState:(state, action)=>{
        state.isExportData = action.payload
      }

      
    },
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

      [txnChartDataSlice.fulfilled]: (state, action) => {
        state.txnChartData = action.payload;
      },
      [txnChartDataSlice.pending]: (state) => {
        state.txnChartData=[];
      },
      [txnChartDataSlice.rejected]: (state) => {
        state.txnChartData=[];
      },

      [fetchSettlementReportSlice.fulfilled]: (state, action) => {
        // state.isLoadingTxnHistory = false;
        state.settlementReport = action.payload;
      },
      [fetchSettlementReportSlice.pending]: (state) => {
        // state.isLoadingTxnHistory = true;
        state.settlementReport=[];
      },
      [fetchSettlementReportSlice.rejected]: (state) => {
        // state.isLoadingTxnHistory = false;
        state.settlementReport=[];
      },

      [fetchRefundTransactionHistory.fulfilled]: (state, action) => {
        // state.isLoadingTxnHistory = false;
        state.settlementReport = action.payload;

        // console.log(state.refundTransactionHistory = action.payload,"my payload")
      },
      [fetchRefundTransactionHistory.pending]: (state) => {
        // state.isLoadingTxnHistory = true;
        state.settlementReport=[];
      },
      [fetchRefundTransactionHistory.rejected]: (state) => {
        // state.isLoadingTxnHistory = false;
        state.settlementReport=[];
      },

      [fetchChargebackTxnHistory.fulfilled]: (state, action) => {
        // state.isLoadingTxnHistory = false;
        state.settlementReport = action.payload;
      },
      [fetchChargebackTxnHistory.pending]: (state) => {
        // state.isLoadingTxnHistory = true;
        state.settlementReport=[];
      },
      [fetchChargebackTxnHistory.rejected]: (state) => {
        // state.isLoadingTxnHistory = false;
        state.settlementReport=[];
      },




      
      },
  })

// Action creators are generated for each case reducer function
export const { clearTransactionHistory , clearSuccessTxnsummary, clearSettlementReport, productSubscribeState, exportTxnLoadingState } = dashboardSlice.actions
export const dashboardReducer = dashboardSlice.reducer
