import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../config";

import {
  axiosInstanceJWT,
 
} from "../utilities/axiosInstance";


const initialState = { 
 signupDataDetails:{
    merchant_info:[],
    count:0
  }

    
   
};


export const fetchSignupData = createAsyncThunk(
    "signupData/fetchSignupData",
    async (requestParam) => {
        try {
        const response = await axiosInstanceJWT.post(
          `${API_URL.GET_SIGNUP_DATA_INFO}?page=${requestParam.page}&page_size=${requestParam.pageSize}`,
          requestParam
        );
        return response.data;
      } catch (error) {
        return error;
      }
    }
  );
  


  export const signupDataSlice = createSlice({
    name: "signupData",
    initialState,
    reducers: {},
     
    extraReducers: {
      [fetchSignupData.pending]: (state, action) => {
        state.status = "pending";
        state.isLoading = true;
     
        
      },
      [fetchSignupData.fulfilled]: (state, action) => {
         state.isLoading = false;
        state.signupDataDetails=action.payload
        },
      [fetchSignupData.rejected]: (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.isLoading = false;
      },
      // ------------------------------------ For Comments ---------------------
    
    }
  });
  export const {
   
  } = signupDataSlice.actions;
  export const signupDataReducer = signupDataSlice.reducer;
  