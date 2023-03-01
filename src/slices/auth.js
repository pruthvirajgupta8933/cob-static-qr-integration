import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import { axiosInstance } from "../utilities/axiosInstance";
import AuthService from "../services/auth.service";
import TokenService from "../services/token.service";

const user = JSON.parse(sessionStorage.getItem("user"));
// console.log("user",user)
const userAlreadyLoggedIn = user && user.loginId !== null ? true : false;

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
  user: user,
  isLoggedIn: null,
  currentUser: {},
  status: "",
  error: "",
  userAlreadyLoggedIn: userAlreadyLoggedIn,
  otpVerified: false,
  isUserRegistered: null,
  subscriptionplandetail: [],
  createClientProfile: [],
  passwordChange: null,
  forgotPassword: {
    otpResponse: {
      verification_token: "",
      status: false
    },
    sendUserName: {
      username: "",
      isValid: null
    },
    otpVerify: {
      emailOtp: null,
      smsOtp: null,
    },
    createNewPassowrd: null,
    isNewPasswordCreated: null,
  },
  payLinkPermission: [],
  avalabilityOfClientCode:{}
};


export const register = createAsyncThunk(
  "auth/register",
  async (dataObj, thunkAPI) => {
    try {
      const response = await AuthService.register(dataObj);
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
      const data = await AuthService.login(username, password);
      // console.log("data",data)
      TokenService.setUser(data)
      return { user: data };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() || error.request.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);              // here we pass message for error
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
    const response = await axiosInstance.post(
      `https://api.msg91.com/api/sendhttp.php?sender=SPTRAN&route=4&mobiles=mobileNO&authkey=177009ASboH8XM59ce18cb&DLT_TE_ID=1107161794798561616&country=91&message=Dear,`,
      { ...requestParam, type: "back_office" }
    ).catch((error) => {
      return error.response;
    });
    return response.data;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await AuthService.logout();
});

export const udpateRegistrationStatus = createAsyncThunk("auth/udpateRegistrationStatus", async () => {
  await AuthService.logout();
});

// check and remove fn
export const successTxnSummary = createAsyncThunk(
  "auth/successTxnSummary",
  async (object, thunkAPI) => {
    try {
      const { fromDate, toDate, clientCode } = object;
      const response = await AuthService.successTxnSummary(fromDate, toDate, clientCode);
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
      const response = await AuthService.createClintCode(data);
      thunkAPI.dispatch(setMessage(response.data.message));

      const userLocalData = JSON.parse(localStorage?.getItem("user"));
      const allData = Object.assign(userLocalData, response.data);
      // first time need to assign all request data into temp data
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
        "pocAccountManager": null,
        "business_cat_code": null
      };

      const mergeclientMerchantDetailsList = Object.assign(clientMerchantDetailsListObj, response.data);
      const clientMerchantDetailsList = [mergeclientMerchantDetailsList];
      allData.clientMerchantDetailsList = clientMerchantDetailsList;
      sessionStorage.setItem("user", JSON.stringify(allData))
      sessionStorage.setItem("categoryId",1)
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
  async ({ data }, thunkAPI) => {
    try {
      const response = await AuthService.updateClientProfile(data);
      thunkAPI.dispatch(setMessage(response.data.message));
      const userLocalData = JSON.parse(localStorage?.getItem("user"));
      const allData = Object.assign(userLocalData, data);
      const clientMerchantDetailsListObj = {
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
        "pocAccountManager": null,
        "business_cat_code": null
      };

      const mergeclientMerchantDetailsList = Object.assign(clientMerchantDetailsListObj, response.data);
      const clientMerchantDetailsList = [mergeclientMerchantDetailsList];
      allData.clientMerchantDetailsList = clientMerchantDetailsList;
      sessionStorage.setItem("user", JSON.stringify(allData))
      sessionStorage.setItem("categoryId",1)

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
  async (requestParam) => {
    const response = await AuthService.changePassword(requestParam)
      .catch((error) => {
        return error.response;
      });
    return response.data;
  }
);

// check client code is exists
export const checkClientCodeSlice = createAsyncThunk(
  "auth/checkClientCodeSlice",
  async (requestParam) => {
    const response = await AuthService.checkClintCode(requestParam)
      .catch((error) => {
        return error.response;
      });
    return response.data;
  }
);

// forgot password
export const getEmailToSendOtpSlice = createAsyncThunk(
  "auth/getEmailToSendOtp",
  async (data, thunkAPI) => {
    try {
      const response = await AuthService.getEmailToSendOTP(data);
      thunkAPI.dispatch(setMessage(response.data.message));
      //save post username
      response.data.username = data.username
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

)




export const verifyOtpOnForgotPwdSlice = createAsyncThunk(
  "auth/verifyOtpOnForgotPwd",
  async (data, thunkAPI) => {
    try {
      const response = await AuthService.verifyOtpOnForgotPwd(data);
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

)



export const createNewPasswordSlice = createAsyncThunk(
  "auth/createNewPassword",
  async (data, thunkAPI) => {
    try {
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
)



export const checkPermissionSlice = createAsyncThunk(
  "auth/checkPermission",
  async (data, thunkAPI) => {
    try {

      const response = await AuthService.checkPermission(data);
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
)




const authSlice = createSlice({
  name: "auth",
  initialState: auth,
  reducers: {
    isUserAlreadyLogin: (state, action) => {
      // console.log(action)
      // state.userAlreadyLoggedIn = 
    }
  },
  extraReducers: {
    [checkClientCodeSlice.fulfilled]: (state, action) => {
      state.avalabilityOfClientCode = action.payload
    },
    [register.pending]: (state, action) => {
      state.isLoggedIn = null
      state.isUserRegistered = null;
    },
    [register.fulfilled]: (state, action) => {
      state.isLoggedIn = null
      state.isUserRegistered = true;
    },
    [register.rejected]: (state, action) => {
      state.isLoggedIn = null
      state.isUserRegistered = false;
    },
    [udpateRegistrationStatus.fulfilled]: (state, action) => {
      state.isLoggedIn = null
      state.isUserRegistered = null;
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
      // console.log("action",action)

      let loggedInStatus = false;
      let isValidData = '';
      const loginState = action.payload?.user?.loginStatus;
      loggedInStatus = false;
      if (loginState === "Activate") {
        loggedInStatus = true;
        isValidData = 'Yes';
        state.userAlreadyLoggedIn = true;
      } else {
        loggedInStatus = false;
        isValidData = 'No';
      }
      state.isLoggedIn = loggedInStatus;
      state.user = action.payload.user;
      sessionStorage.setItem("user", JSON.stringify(state.user))
      sessionStorage.setItem("categoryId",1)
      state.isValidUser = isValidData;
    },
    [login.pending]: (state) => {
      state.isLoggedIn = null;
      // state.userAlreadyLoggedIn = false;
      state.isValidUser = '';
      state.user = null;
    },
    [login.rejected]: (state, action) => {
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
      state = {};
    },
    
    [createClientProfile.fulfilled]: (state, action) => {
      state.createClientProfile = action.payload
      state.user = action.payload
    },
  
    [updateClientProfile.fulfilled]: (state, action) => {
      state.user = action.payload
    },
    [updateClientProfile.rejected]: () => {
    },
    [changePasswordSlice.fulfilled]: (state, action) => {
      state.passwordChange = true;
    },
    [changePasswordSlice.pending]: (state) => {
      state.passwordChange = null;
    },
    [changePasswordSlice.rejected]: (state) => {
      state.passwordChange = false;
    },

    [getEmailToSendOtpSlice.fulfilled]: (state, action) => {
      state.forgotPassword.otpResponse = action.payload;
      const username = action.payload.username;
      const status = action.payload.status;
      state.forgotPassword.sendUserName.username = username;
      state.forgotPassword.sendUserName.isValid = status ? true : false;
    },
    [getEmailToSendOtpSlice.pending]: (state) => {
    },
    [getEmailToSendOtpSlice.rejected]: (state, action) => {
      state.forgotPassword.sendUserName.isValid = false;
    },

 
    [checkPermissionSlice.fulfilled]: (state, action) => {
       
      // state.passwordChange = false;
      state.payLinkPermission = action.payload
    }




  },
});


export const { isUserAlreadyLogin } = authSlice.actions
const { reducer } = authSlice;
export default reducer;
