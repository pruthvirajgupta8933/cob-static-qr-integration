import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { midCreateApi } from "../services/generate-mid/generate-mid.service";
import { setMessage } from "./message";




const initialState = { 
    postdata:{},
   
};


export const createMidApi = createAsyncThunk(
    "mid/createMidApi",
    async (dataObj, thunkAPI) => {
      try {
        const response = await midCreateApi(dataObj);
        console.log("response",response)
        thunkAPI.dispatch(setMessage(response.data.message));
        return response.data;
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.detail) ||
          error.detail ||
          error.toString();
          console.log("message",message)
        thunkAPI.dispatch(setMessage(message));
        return thunkAPI.rejectWithValue();
      }
    }
  );






  

  export const generateMidSlice = createSlice({
    name: "merchnatzone",
    initialState,
    reducers: {},
     
    extraReducers: {
      [createMidApi.pending]: (state, action) => {
        state.status = "pending";
        
      },
      [createMidApi.fulfilled]: (state, action) => {
       

      },
      [createMidApi.rejected]: (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      },
      // ------------------------------------ For Comments ---------------------


       
    
    }
  });
  export const {
   
  } = generateMidSlice .actions;
  export const genreateMidReducer = generateMidSlice.reducer;
  