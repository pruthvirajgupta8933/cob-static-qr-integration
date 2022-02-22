import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import {Dashboardservice} from "../services/dashboard.service";
import profileService from "../services/profile.service";


const initialState = { successTxnsumry:[], isLoading:false, subscribedService: [], subscriptionplandetail: [], createClientProfile:[] };



/* ======Start Profile Function ======= */
// export const createClientProfile = createAsyncThunk(
//   "dashboard/createClientProfile",
//   async (data, thunkAPI) => {
//     try {
//       console.log("dashboardslice",data);
//       // console.log({ fromdate, todate, clientcode });
//       const response = await profileService.createClintCode(data);
//       thunkAPI.dispatch(setMessage(response.data.message));

//       const userLocalData = JSON.parse(localStorage?.getItem("user"));
//       const allData = Object.assign(userLocalData,response.data);


//       const clientSuperMasterListObj = {
//         "clientId": null,
//         "lookupState": null,
//         "address": null,
//         "clientAuthenticationType": null,
//         "clientCode": null,
//         "clientContact": null,
//         "clientEmail": null,
//         "clientImagePath": null,
//         "clientLink": null,
//         "clientLogoPath": null,
//         "clientName": null,
//         "failedUrl": null,
//         "landingPage": null,
//         "service": null,
//         "successUrl": null,
//         "createdDate": null,
//         "modifiedDate": null,
//         "modifiedBy": null,
//         "status": null,
//         "reason": null,
//         "merchantId": null,
//         "requestId": null,
//         "clientType": null,
//         "parentClientId": null,
//         "businessType": null,
//         "pocAccountManager": null
//       };

//       const mergeClientSuperMasterList = Object.assign(clientSuperMasterListObj,response.data);
//       console.log("mergeClientSuperMasterList",mergeClientSuperMasterList)
//       const clientSuperMasterList =  [mergeClientSuperMasterList];
//       allData.clientSuperMasterList = clientSuperMasterList;
//       localStorage.setItem("user", JSON.stringify(allData))


//       return response.data;
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       thunkAPI.dispatch(setMessage(message));
//       return thunkAPI.rejectWithValue();
//     }
//   }
// );

// export const updateClientProfile = createAsyncThunk(
//   "dashboard/updateClientProfile",
//   async ({data,clientId}, thunkAPI) => {
//     try {
//       console.log("update functon",data);
//       console.log("update functon",clientId);
//       // console.log({ fromdate, todate, clientcode });===update fn call
//       const response = await profileService.updateClientProfile(data,clientId);
//       thunkAPI.dispatch(setMessage(response.data.message));
//       const userLocalData = JSON.parse(localStorage?.getItem("user"));
//       const allData = Object.assign(userLocalData,data);
//       console.log("userLocalData",userLocalData);
//       console.log("response.data",data);
//       console.log("all data",allData);

//       const clientSuperMasterListObj = {
//         "clientId": null,
//         "lookupState": null,
//         "address": null,
//         "clientAuthenticationType": null,
//         "clientCode": null,
//         "clientContact": null,
//         "clientEmail": null,
//         "clientImagePath": null,
//         "clientLink": null,
//         "clientLogoPath": null,
//         "clientName": null,
//         "failedUrl": null,
//         "landingPage": null,
//         "service": null,
//         "successUrl": null,
//         "createdDate": null,
//         "modifiedDate": null,
//         "modifiedBy": null,
//         "status": null,
//         "reason": null,
//         "merchantId": null,
//         "requestId": null,
//         "clientType": null,
//         "parentClientId": null,
//         "businessType": null,
//         "pocAccountManager": null
//       };

//       const mergeClientSuperMasterList = Object.assign(clientSuperMasterListObj,data);
//       console.log("mergeClientSuperMasterList",mergeClientSuperMasterList)
//       const clientSuperMasterList =  [mergeClientSuperMasterList];
//       allData.clientSuperMasterList = clientSuperMasterList;
//       console.log("after update user",allData);
//       localStorage.setItem("user", JSON.stringify(allData))

//       return allData;
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       thunkAPI.dispatch(setMessage(message));
//       return thunkAPI.rejectWithValue();
//     }
//   }
// );



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
      // [createClientProfile.pending]:(state)=>{
      //   state.createClientProfile = {}
      // },
      // [createClientProfile.fulfilled]:(state,action)=>{
      //   state.createClientProfile = action.payload
      // },
      // [updateClientProfile.pending]:(state)=>{
      //     console.log('pending profile');
          
      // },
      // [updateClientProfile.fulfilled]:(state,action)=>{
      //   console.log('fulfilled profile');
      //   console.log("user",state.auth.user)
      //   state.createClientProfile = action.payload
      // },
      // [updateClientProfile.rejected]:()=>{
      //   console.log('rejected profile');
      // },
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