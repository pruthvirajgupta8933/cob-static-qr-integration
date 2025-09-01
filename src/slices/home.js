import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import HomeService from "../services/home.service";


export const successTxnSummary = createAsyncThunk(
  "home/successTxnSummary",
  async ({ fromdate, todate, clientcode }, thunkAPI) => {
    try {
      // console.log({ fromdate, todate, clientcode });
      const response = await HomeService.successTxnSummary(fromdate, todate, clientcode );
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

const initialState = { successTxnSummaryHome: {},isLoading:false  }
const homeSlice = createSlice({
  name: "home",
  initialState,
  extraReducers: {
      
    [successTxnSummary.pending]: (state, action) => {
        state.isLoading = true;
      },
    [successTxnSummary.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.successTxnSummaryHome = action.payload.data;
    },
    [successTxnSummary.rejected]: (state, action) => {
      state.isLoading = false;
    },
   
  },
});

const { reducerHome } = homeSlice;
export default reducerHome;
