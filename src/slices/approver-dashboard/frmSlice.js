import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { frmPushMerchantData, frmSingleScreeningApi } from "../../services/approver-dashboard/frm/frm.service";
import { setMessage } from "../message";

const initialState = {
  postdata: {},

};

export const checkFrmPushData = createAsyncThunk(
  "frm/checkFrmPushData",
  async (dataObj, thunkAPI) => {
    try {
      const response = await frmPushMerchantData(dataObj);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.detail) ||
        error.detail ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message); // Return the message here
    }
  }
);


export const frmSingleScreening = createAsyncThunk(
  "frm/frmSingleScreening",
  async (dataObj, thunkAPI) => {
    try {
      const response = await frmSingleScreeningApi(dataObj);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.detail) ||
        error.detail ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message); // Return the message here
    }
  }
);




export const frmSlice = createSlice({
  name: "frm",
  initialState,
  reducers: {},

  extraReducers: {
    [checkFrmPushData.pending]: (state, action) => {
      state.status = "pending";

    },
    [checkFrmPushData.fulfilled]: (state, action) => {


    },
    [checkFrmPushData.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    // ------------------------------------ For Comments ---------------------




  }
});
export const {

} = frmSlice.actions;
export const frmReducer = frmSlice.reducer;
