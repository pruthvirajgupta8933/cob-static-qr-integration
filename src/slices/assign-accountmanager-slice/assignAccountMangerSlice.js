import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import assignAccountMangerService from "../../services/assign-account-manager/assign-account-manager.service";
import { setMessage } from "../message";

const initialState = { 
    postdata:{},
   
};

 export const assignAccountMangerApi = createAsyncThunk(
    "assignAccountManagere/assignAccountMangerApi",
    async (requestParam, thunkAPI) => {
  
      try {
        const response = await assignAccountMangerService.assignAccountMangerApi(requestParam);
        // thunkAPI.dispatch(setMessage(response.data.message));
        return response.data;
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString() || error.request.toString();
        thunkAPI.dispatch(setMessage(message));
        return thunkAPI.rejectWithValue(message);
  
  
      }
    }
  );


  export const assignManagerDetails = createAsyncThunk(
    "assignAccountManagere/assignManagerDetails",
    async (requestParam, thunkAPI) => {
  
      try {
        const response = await assignAccountMangerService.assignManagerDetails(requestParam);
        // thunkAPI.dispatch(setMessage(response.data.message));
        return response.data;
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString() || error.request.toString();
        thunkAPI.dispatch(setMessage(message));
        return thunkAPI.rejectWithValue(message);
  
  
      }
    }
  );





  
  export const assignAccountManagerSlice = createSlice({
    name: "assignAccountManager",
    initialState,
    reducers: {},
     
    extraReducers: {
      [assignAccountMangerApi.pending]: (state, action) => {
        state.status = "pending";
        
      },
      [assignAccountMangerApi.fulfilled]: (state, action) => {
       

      },
      [assignAccountMangerApi.rejected]: (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      },
      // ------------------------------------ For Comments ---------------------


      
      
    
    }
  });
  export const {
   
  } = assignAccountManagerSlice.actions;
  export const assignAccountManagerReducer = assignAccountManagerSlice.reducer;
  