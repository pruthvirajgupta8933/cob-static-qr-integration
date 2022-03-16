import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import Axios from "axios";

import AuthService from "../services/auth.service";
// import { NULL } from "node-sass";

const user = JSON.parse(localStorage.getItem("user"));
// console.log("user",user);
const userAlreadyLoggedIn = user && user.loginId!==null ? true :false;

const auth = {
  LoginResponse: { message: "", verification_token: "", response_code: "" },
  OtpVerificationResponse: {
    fulfilled: {
      auth_token: "",
      jwt_token: {
        refresh: "",
        access: "",
      },
      user_token: {
        login_token: "",
        tab_login: "",
      },
      response_code: "",
    },
    rejected: {
      message: "",
      response_code: "",
    },
  },
  user:user,
  isLoggedIn:null,
  currentUser: {},
  status: "",
  error: "",
  userAlreadyLoggedIn: userAlreadyLoggedIn,
  otpVerified: false,
  isUserRegistered:null,
  subscriptionplandetail: [],
  createClientProfile:[],
  passwordChange:null,
  forgotPassword:{
    sendUserName:{
      username:"",
      isValid:null
    },
    otpVerify:{
      emailOtp:null,
      smsOtp:null,
    },
    createNewPassowrd:null,
    isNewPasswordCreated:null,
  },
  payLinkPermission:[]
};


export const register = createAsyncThunk(
  "auth/register",
  async ({ firstName, lastName, mobileNumber, email, password,businessType }, thunkAPI) => {
    try {
      const response = await AuthService.register(firstName, lastName, mobileNumber, email, password,businessType);
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

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, thunkAPI) => {
    try {
      // console.log("auth",username);
      
      const data = await AuthService.login(username, password);
      return { user: data };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()||error.request.toString();
        console.log("message",message);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const sendEmail = createAsyncThunk(
  "auth/sendEmail",
  async ({ toEmail, toCc, subject, msg }, thunkAPI) => {
    try {
      const response = await AuthService.sendEmail(toEmail, toCc, subject, msg);
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

export const OTPVerificationApi = createAsyncThunk(
  "auth/OTPVerification",
  async (requestParam) => {
    const response = await Axios.post(
      `https://api.msg91.com/api/sendhttp.php?sender=SPTRAN&route=4&mobiles=mobileNO&authkey=177009ASboH8XM59ce18cb&DLT_TE_ID=1107161794798561616&country=91&message=Dear,`,
      { ...requestParam, type: "back_office" }
    ).catch((error) => {
      return error.response;
    });
    return response.data;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  // console.log("comes to logout");
  await AuthService.logout();
  
});

// check and remove fn
export const successTxnSummary = createAsyncThunk(
  "auth/successTxnSummary",
  async (object, thunkAPI) => {
    try {
      // console.log(object);
      const {fromDate,toDate,clientCode} = object;
      const response = await AuthService.successTxnSummary(fromDate,toDate,clientCode );
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




/* ======Start Profile Function ======= */
export const createClientProfile = createAsyncThunk(
  "auth/createClientProfile",
  async (data, thunkAPI) => {
    try {
      // console.log('a-senddata',data);
      const response = await AuthService.createClintCode(data);
      thunkAPI.dispatch(setMessage(response.data.message));

      const userLocalData = JSON.parse(localStorage?.getItem("user"));
      const allData = Object.assign(userLocalData,response.data);
      // first time need to assign all request data into temp data
      allData.accountHolderName = data.accountHolderName;
      allData.accountNumber = data.accountNumber;
      allData.bankName = data.bankName;
      allData.clientAuthenticationType = data.clientAuthenticationType;
      allData.clientContactPersonName = data.clientName;
      allData.clientEmail = data.email;
      allData.ifscCode = data.ifscCode;
      allData.pan = data.pan;
      allData.clientMobileNo = data.phone;
     
      // console.log("allData--s",allData);
      const clientMerchantDetailsListObj = {
        "clientId": null,
        "lookupState": null,
        "address": null,
        "clientAuthenticationType": null,
        "clientCode": null,
        "clientContact": null,
        "clientEmail": null,
        "clientImagePath": null,
        "clientLink": null,
        "clientLogoPath": null,
        "clientName": null,
        "failedUrl": null,
        "landingPage": null,
        "service": null,
        "successUrl": null,
        "createdDate": null,
        "modifiedDate": null,
        "modifiedBy": null,
        "status": null,
        "reason": null,
        "merchantId": null,
        "requestId": null,
        "clientType": null,
        "parentClientId": null,
        "businessType": null,
        "pocAccountManager": null
      };

      const mergeclientMerchantDetailsList = Object.assign(clientMerchantDetailsListObj,response.data);
      // console.log("mergeclientMerchantDetailsList",mergeclientMerchantDetailsList)
      const clientMerchantDetailsList =  [mergeclientMerchantDetailsList];
      allData.clientMerchantDetailsList = clientMerchantDetailsList;
      localStorage.setItem("user", JSON.stringify(allData))


      return allData;
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

export const updateClientProfile = createAsyncThunk(
  "auth/updateClientProfile",
  async ({data,clientId}, thunkAPI) => {
    try {
      // console.log("update functon",data);
      // console.log("update functon",clientId);
      // console.log({ fromdate, todate, clientcode });===update fn call
      const response = await AuthService.updateClientProfile(data,clientId);
      thunkAPI.dispatch(setMessage(response.data.message));
      const userLocalData = JSON.parse(localStorage?.getItem("user"));
      const allData = Object.assign(userLocalData,data);
      // console.log("userLocalData",userLocalData);
      // console.log("data",data);
      // console.log("response.data",response.data);
      // console.log("all data",allData);

      const clientMerchantDetailsListObj = {
        "clientId": clientId,
        "lookupState": null,
        "address": null,
        "clientAuthenticationType": null,
        "clientCode": null,
        "clientContact": null,
        "clientEmail": null,
        "clientImagePath": null,
        "clientLink": null,
        "clientLogoPath": null,
        "clientName": null,
        "failedUrl": null,
        "landingPage": null,
        "service": null,
        "successUrl": null,
        "createdDate": null,
        "modifiedDate": null,
        "modifiedBy": null,
        "status": null,
        "reason": null,
        "merchantId": null,
        "requestId": null,
        "clientType": null,
        "parentClientId": null,
        "businessType": null,
        "pocAccountManager": null
      };

      const mergeclientMerchantDetailsList = Object.assign(clientMerchantDetailsListObj,response.data);
      // console.log("mergeclientMerchantDetailsList",mergeclientMerchantDetailsList)
      const clientMerchantDetailsList =  [mergeclientMerchantDetailsList];
      allData.clientMerchantDetailsList = clientMerchantDetailsList;
      // console.log("after update user",allData);
      localStorage.setItem("user", JSON.stringify(allData))

      return allData;
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

// change password


export const changePasswordSlice = createAsyncThunk(
  "auth/changePasswordSlice",
  async (data, thunkAPI) => {
    try {
      // console.log({ fromdate, todate, clientcode });===update fn call
      // console.log(data);
      const response = await AuthService.changePassword(data);
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


// forgot password

export const getEmailToSendOtpSlice = createAsyncThunk(
  "auth/getEmailToSendOtp",
  async(data,thunkAPI)=>{
    try{
      console.log("getEmailToSendOtp",data);
      const response = await AuthService.getEmailToSendOTP(data);
      thunkAPI.dispatch(setMessage(response.data.message));
      //save post username
      response.data.username = data.username
      // console.log("getEmailToSendOtp-response",response.headers)
      return response.data;
    }catch(error){
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

)




export const verifyOtpOnForgotPwdSlice = createAsyncThunk(
  "auth/verifyOtpOnForgotPwd",
  async(data,thunkAPI)=>{
    try{
      console.log("verifyOtpOnForgotPwd",data);
      const response = await AuthService.verifyOtpOnForgotPwd(data);
      thunkAPI.dispatch(setMessage(response.data.message));
      console.log("verifyOtpOnForgotPwd",response)
      return response.data;
    }catch(error){
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

)



export const createNewPasswordSlice = createAsyncThunk(
  "auth/createNewPassword",
  async(data,thunkAPI)=>{
    try{
      console.log("createNewPassword",data);
      const response = await AuthService.changePassword(data);
      thunkAPI.dispatch(setMessage(response.data.message));
      console.log("getEmailToSendOtp-response",response)
      return response.data;
    }catch(error){
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
)



export const checkPermissionSlice = createAsyncThunk(
  "auth/checkPermission",
  async(data,thunkAPI)=>{
    try{
    
      const response = await AuthService.checkPermission(data);
      thunkAPI.dispatch(setMessage(response.data.message));
      // console.log("getEmailToSendOtp-response",response)
      return response.data;
    }catch(error){
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
)




const initialState = user && user.loginStatus
  ? { isLoggedIn: true, user,isValidUser:'',successTxnsumry:{} }
  : { isLoggedIn: false, user: null,isValidUser:'',successTxnsumry:{}, sendEmail: {} };
// console.log(register)
const authSlice = createSlice({
  name: "auth",
  initialState: auth,
  extraReducers: {
    [register.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
      state.isUserRegistered = true;
    },
    [register.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.isUserRegistered = false;
    },
    [successTxnSummary.fulfilled]: (state, action) => {
      state.successTxnsumry = action.payload;
    },
    [successTxnSummary.rejected]: (state, action) => {
      //code 
    },
    [sendEmail.fulfilled]: (state, action) => {
      state.sendEmail = action.payload.data;
    },
    [sendEmail.rejected]: (state, action) => {
      //code 
    },
    [login.fulfilled]: (state, action) => {
      let loggedInStatus = false;
      let isValidData ='';

      // if(action.payload.user && action.payload.user!==null){
        const loginState = action.payload?.user?.loginStatus;
        loggedInStatus = false;
        // console.log("loginState",loginState);
          if(loginState==="Activate"){
              loggedInStatus = true;
              isValidData = 'Yes';
              
            }else{
              loggedInStatus = false;
              isValidData = 'No';
            }
        // }else{
                // loggedInStatus = false;
                // isValidData = 'No';
        // }

      state.isLoggedIn = loggedInStatus;
      state.user = action.payload.user;
      if(action.payload.user?.clientSuperMasterList!==null)
      {
        state.user.clientMerchantDetailsList  = action.payload.user.clientSuperMasterList
      }
        
      localStorage.setItem("user",JSON.stringify(state.user))
      state.isValidUser = isValidData;
    },
    [login.pending]: (state) => {
      state.isLoggedIn = null;
      state.userAlreadyLoggedIn = false;
      state.isValidUser = '';
      state.user = null;
    },
    [login.rejected]: (state) => {
      state.isLoggedIn = false;
      state.userAlreadyLoggedIn = false;
      state.isValidUser = '';
      state.user = null;
    },
    [logout.fulfilled]: (state, action) => {
      state.isLoggedIn = null;
      state.userAlreadyLoggedIn = false;
      state.isValidUser = '';
      state.user = null;
      state=undefined;
    },
    [OTPVerificationApi.pending]: (state, action) => {
      state.status = "pending";
    },
    [OTPVerificationApi.fulfilled]: (state, action) => {
      state.OtpVerificationResponse.fulfilled = action.payload;

      sessionStorage.setItem(
        "authToken",
        action.payload.auth_token ? action.payload.auth_token : ""
      );
      sessionStorage.setItem(
        "userName",
        action.payload.username ? action.payload.username : ""
      );
    },
    [OTPVerificationApi.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    [createClientProfile.pending]:(state)=>{
      console.log("pending...create profile of client")
    },
    [createClientProfile.fulfilled]:(state,action)=>{
      state.createClientProfile = action.payload
      state.user = action.payload
      console.log("client create and update",state.user);
    },
    [createClientProfile.rejected]:(state)=>{
      console.log("Client Profile not update!");
    },
    [updateClientProfile.pending]:(state)=>{
        console.log('pending profile');
    },
    [updateClientProfile.fulfilled]:(state,action)=>{
      console.log('fulfilled profile');
      state.user = action.payload
    },
    [updateClientProfile.rejected]:()=>{
      console.log('rejected profile');
    },
    [changePasswordSlice.fulfilled]:(state,action)=>{
      console.log('fullfiled profile');
      state.passwordChange = true;
    },
    [changePasswordSlice.pending]:(state)=>{
      console.log('rejected profile');
      state.passwordChange = null;
    },
    [changePasswordSlice.rejected]:(state)=>{
      console.log('rejected profile');
      state.passwordChange = false;
    },

    [getEmailToSendOtpSlice.fulfilled]:(state,action)=>{
      const username = action.payload.username;
      const status = action.payload.status;
      state.forgotPassword.sendUserName.username = username;
      state.forgotPassword.sendUserName.isValid = status ? true : false;
      //state.passwordChange = true;
    },
    [getEmailToSendOtpSlice.pending]:(state)=>{
      console.log('pending profile');
      //state.passwordChange = null;
    },
    [getEmailToSendOtpSlice.rejected]:(state,action)=>{
      console.log('rejected ',action);
      state.forgotPassword.sendUserName.isValid = false;
      //state.passwordChange = false;
    },
    
    [verifyOtpOnForgotPwdSlice.fulfilled]:(state,action)=>{
      console.log('fullfiled ',action);
      // state.passwordChange = true;
    },
    [verifyOtpOnForgotPwdSlice.pending]:(state)=>{
      console.log('pending profile');
      // state.passwordChange = null;
    },
    [verifyOtpOnForgotPwdSlice.rejected]:(state)=>{
      console.log('rejected profile');
      // state.passwordChange = false;
    },
    
    [createNewPasswordSlice.fulfilled]:(state,action)=>{
      console.log('fullfiled',action);
      // state.passwordChange = true;
    },
    [createNewPasswordSlice.pending]:(state)=>{
      console.log('pending profile');
      // state.passwordChange = null;
    },
    [createNewPasswordSlice.rejected]:(state)=>{
      console.log('rejected profile');
      // state.passwordChange = false;
    },
    
    [checkPermissionSlice.fulfilled]:(state,action)=>{
      // console.log('rejected profile');
      // state.passwordChange = false;
      state.payLinkPermission = action.payload
    }

    

  },
});

const { reducer } = authSlice;
export default reducer;
