import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import { cinDetail } from "../services/kyc-validator-service/kycValidator.service";




const initialState = {};

  
export const cinLookupApi = createAsyncThunk(
    "kycValidator/cinLookupApi",
    async ( requestParam, thunkAPI) => {
      try {
        const response = await cinDetail(requestParam)
        return response.data;
      } catch (error) {
        const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() || error.request.toString();
      thunkAPI.dispatch(setMessage(message));
      console.log("message",message)
      return thunkAPI.rejectWithValue(message); 
        
        
      }
    }
  );

  export const kycValidatorSlice = createSlice({
    name: "kycValidator",
    initialState,
    reducers: {},
   extraReducers: {}
  });


  export const kycValidatorReducer = kycValidatorSlice.reducer;
  

  
  
  
  
  

  