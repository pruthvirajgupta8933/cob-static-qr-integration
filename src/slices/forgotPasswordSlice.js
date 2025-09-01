import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { midCreateApi } from "../services/generate-mid/generate-mid.service";
import { setMessage } from "./message";
import { emailVerify } from "../services/forgotPassword-service/forgotPassword.service";




const initialState = { 
    postdata:{},
   
};

export const verifyOtp = createAsyncThunk(
  "forgotPassword/verifyOtp",
  async (dataObj, thunkAPI) => {
    try {
      const response = await emailVerify(dataObj);
      
     // thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } 
    catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.detail) ||
        error.detail ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const forgotPasswordSlice = createSlice({
    name: "forgotPassword",
    initialState,
    reducers: {},
     
    extraReducers: {}
  });
  export const {
   
  } = forgotPasswordSlice.actions;
  export const forgotPassworReducer = forgotPasswordSlice.reducer;
  