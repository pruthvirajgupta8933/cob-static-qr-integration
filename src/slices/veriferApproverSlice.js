import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import veriferApproverService from "../services/verify-approve-kyc.service";



const initialState = { verifyKyc: {},approveKyc:{} }


export const verifyKyc = createAsyncThunk(
    "veriferApprover/createClientProfile",
    async (object, thunkAPI) => {
      try {
        // console.log({ fromdate, todate, clientcode });
        const response = await veriferApprover.verifyKycTab(object);
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


  const veriferApproverSlice = createSlice({
    name: "veriferApprover",
    initialState,
    extraReducers: {
      [verifyKyc.pending]: (state, action) => {
          state.isLoading = true;
        },
      [verifyKyc.fulfilled]: (state, action) => {
        state.isLoading = false;
        state.createClientProfile = action.payload.data;
      },
      [verifyKyc.rejected]: (state, action) => {
        state.isLoading = false;
      },
     
    },
  });


  // console.log(veriferApproverSlice)
  const { veriferApprover} = veriferApproverSlice;

export default veriferApprover;