//-----------------For handling the response and verifying the otp -----------------------
import {
  createSlice,
  createAsyncThunk
} from "@reduxjs/toolkit";
import API_URL from "../config";
import axios from "axios";
import { axiosInstanceAuth } from "../utilities/axiosInstance";


const KycAuth = {
  OtpResponse: {
    status: "",
    verification_token: ""
  },
  OtpVerificationResponseForPhone: {
    status: false,
    message: ""
  },
  OtpVerificationResponseForEmail: {
    status: false,
    message: ""
  }
};



//--------------For Sending the Contact Otp ---------------------
export const otpForContactInfo = createAsyncThunk(
  "OtpForContact/otpContactInfo",
  async (requestParam) => {
    const response = await axiosInstanceAuth.post(
        `${API_URL.Send_OTP}`,
        requestParam,

        {
          headers: {
            // Authorization: ""
          }
        }
      )
      .catch((error) => {
        return error.response;
      });
    // console.log(response)
    return response.data;
  }
);


//---------VERIFICATION OTP For Phone ------------------------
export const otpVerificationForContactForPhone = createAsyncThunk(
  "OtpVerificationForContactForPhone/otpVerificationForContactForPhone",
  async (requestParam) => {
    // console.log("requestParam",requestParam)
    const response = await axiosInstanceAuth.post(
      `${API_URL.Verify_OTP}`,
      requestParam,
    ).catch((error) => {
      return error.response;
    });
    // console.log("res",response);
    return response.data;
  }
);

//---------VERIFICATION OTP For Email------------------------
export const otpVerificationForContactForEmail = createAsyncThunk(
  "OtpVerificationForContactForEmail/otpVerificationForContactForEmail",
  async (requestParam) => {
    // console.log("requestParam",requestParam)
    const response = await axiosInstanceAuth.post(
      `${API_URL.Verify_OTP}`,
      requestParam,
    ).catch((error) => {
      return error.response;
    });
    // console.log("res",response);
    return response.data;
  }
);



const KycOtpSlice = createSlice({
  name: "KycAuth",
  initialState: KycAuth,
  reducers: {
    isPhoneVerified: (state, action) => {
      // console.log(action);
      // console.log(state.OtpVerificationResponseForPhone.status);
      // state.transactionHistory = []
    }
  },
  extraReducers: {
    ////////////////////////////////////////////////////
    [otpForContactInfo.pending]: (state, action) => {
      state.status = "pending";
    },
    [otpForContactInfo.fulfilled]: (state, action) => {
      // console.log("action-11 ====>",action.payload)
      state.OtpResponse = action.payload;
    },
    [otpForContactInfo.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    ////////////////////////////////////////////////////////////

    [otpVerificationForContactForPhone.pending]: (state, action) => {
      state.status = "pending";
    },
    [otpVerificationForContactForPhone.fulfilled]: (state, action) => {
      state.OtpVerificationResponseForPhone = action.payload;

      // console.log(action.payload.status,"==> Verification")
    },
    [otpVerificationForContactForPhone.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    /////////////////////////////////////////////////////////////////

    [otpVerificationForContactForEmail.pending]: (state, action) => {
      state.status = "pending";
    },
    [otpVerificationForContactForEmail.fulfilled]: (state, action) => {
      state.OtpVerificationResponseForEmail = action.payload;

      // console.log(action.payload.status,"==> Verification")
    },
    [otpVerificationForContactForEmail.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },


  },
});


// Action creators are generated for each case reducer function
// export const {
//   isPhoneVerified
// } = KycOtpSlice.actions
// export default KycOtpSlice.reducer;