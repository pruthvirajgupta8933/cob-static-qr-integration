import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import Axios from "axios";

import AuthService from "../services/auth.service";

const user = JSON.parse(localStorage.getItem("user"));
console.log("user",user);
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
  currentUser: {},
  status: "",
  error: "",
  userAlreadyLoggedIn: userAlreadyLoggedIn,
  otpVerified: false,
  isUserRegistered:null,
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


const initialState = user && user.loginStatus
  ? { isLoggedIn: true, user,isValidUser:'',successTxnsumry:{} }
  : { isLoggedIn: false, user: null,isValidUser:'',successTxnsumry:{}, sendEmail: {} };
console.log(register)
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

      if(action.payload.user && action.payload.user!==null){
        const loginState = action.payload.user.loginStatus;
        loggedInStatus = false;
          if(loginState==="Activate"){
              loggedInStatus = true;
              isValidData = 'Yes';
            }
        }else{
                loggedInStatus = false;
                isValidData = 'No';
        }

      state.isLoggedIn = loggedInStatus;
      state.user = action.payload.user;
      state.isValidUser = isValidData;
    },
    [login.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      state.isValidUser = 'No';
    },
    [logout.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      state.isValidUser = '';
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
  },
});

const { reducer } = authSlice;
export default reducer;
