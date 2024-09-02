import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import approverDashboardService from "../../services/approver-dashboard/approverDashboard.service.js";
import { setMessage } from "../message";


const InitialState = {
  businessCategoryType: [],
  generalFormData: {
    isFinalSubmit: false
  },
  clientCodeList: []

}


export const businessCategoryType = createAsyncThunk(
  "approverDashbaordSlice/businessCategoryType",
  async (object = {}, thunkAPI) => {
    try {
      const response = await approverDashboardService.businessCategoryType();

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


export const getAllCLientCodeSlice = createAsyncThunk(
  "approverDashbaordSlice/getAllCLientCodeSlice",
  async (object = {}, thunkAPI) => {
    try {
      const response = await approverDashboardService.getAllClientCode();

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


const approverDashboardSlice = createSlice({
  name: "approverDashboard",
  initialState: InitialState,
  reducers: {
    generalFormData: (state, action) => {
      //  console.log(action.payload)
      state.generalFormData = action.payload
    }
  },
  extraReducers: (builder)=>{
    builder
 .addCase(businessCategoryType.pending,(state)=>{
      state.businessCategoryType = []
    })

    .addCase(businessCategoryType.fulfilled,(state,action)=>{
      state.businessCategoryType = action.payload.result
    })
    .addCase(businessCategoryType.rejected,(state,action)=>{
      state.businessCategoryType = []

    })
    
    .addCase(getAllCLientCodeSlice.pending,(state)=>{
      state.clientCodeList = []
    })
    .addCase(getAllCLientCodeSlice.fulfilled,(state,action)=>{
      state.clientCodeList = action.payload.result
    })
    .addCase(getAllCLientCodeSlice.rejected,(state,action)=>{
      state.clientCodeList = []
    })

   
  }

});


export const { generalFormData } = approverDashboardSlice.actions

const { reducer } = approverDashboardSlice;
export default reducer;