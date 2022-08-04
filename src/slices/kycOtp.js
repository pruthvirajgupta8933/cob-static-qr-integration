//-----------------For handling the response and verifying the otp -----------------------
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../config";
import axios from "axios";


const KycAuth = {
    OtpResponse: { status: "", verification_token: ""},
    OtpVerificationResponse: {         
        status: "",
        message: ""
       }   
  };



  //--------------For Seding the Contact Otp ---------------------
  export const otpForContactInfo = createAsyncThunk(
    "OtpForContact/otpContactInfo",
    async (requestParam) => {
      const response = await axios.post(
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
      return response.data;
    }
  );


    //---------VERIFICATION OTP ------------------------
    export const otpVerificationForContact = createAsyncThunk(
      "OtpVerification/otpVerificationForContact",
      async (requestParam) => {
          // console.log("requestParam",requestParam)
        const response = axios.post(
          `${API_URL.Verify_OTP}`,
          requestParam,
          {
            headers: {
              // Authorization: ""
          },
          }
        ).catch((error) => {
          return error.response;
        });
        // console.log("responsepppppppp",response);
        return response.data;
      }
    );


    const KycOtpSlice = createSlice({
      name: "KycAuth",
      initialState: KycAuth,
      reducers: {},
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
    
        [otpVerificationForContact.pending]: (state, action) => {
          state.status = "pending";
        },
        [otpVerificationForContact.fulfilled]: (state, action) => {
          state.OtpVerificationResponse = action.payload;
          console.log(action,"==>")
        },
        [otpVerificationForContact.rejected]: (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        },
      },
    });
    
    export default KycOtpSlice.reducer;





