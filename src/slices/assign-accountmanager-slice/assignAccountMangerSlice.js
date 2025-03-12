import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import assignAccountMangerService from "../../services/assign-account-manager/assign-account-manager.service";
import { setMessage } from "../message";
import { getErrorMessage } from "../../utilities/errorUtils";

const initialState = {
  postdata: {},

};

export const assignAccountMangerApi = createAsyncThunk(
  "assignAccountManagere/assignAccountMangerApi",
  async (requestParam, thunkAPI) => {

    try {
      const response = await assignAccountMangerService.assignAccountMangerApi(requestParam);
      // thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      // const message =
      //   (error.response &&
      //     error.response.data &&
      //     error.response.data.message) ||
      //   error.message ||
      //   error.toString() || error.request.toString();
      const message = getErrorMessage(error)
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);


    }
  }
);


export const assignmentTypeApi = createAsyncThunk(
  "assignmentTypeApi/assignmentTypeApi ",
  async (requestParam, thunkAPI) => {

    try {
      const response = await assignAccountMangerService.getAssignmentType();
      // thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      // const message =
      //   (error.response &&
      //     error.response.data &&
      //     error.response.data.message) ||
      //   error.message ||
      //   error.toString() || error.request.toString();
      const message = getErrorMessage(error)
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);


    }
  }
);


export const assignRoleWiseApi = createAsyncThunk(
  "assignRoleWise/assignRoleWise ",
  async (requestParam, thunkAPI) => {

    try {
      const response = await assignAccountMangerService.assignRoleWise(requestParam,);
      // thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      // const message =
      //   (error.response &&
      //     error.response.data &&
      //     error.response.data.message) ||
      //   error.message ||
      //   error.toString() || error.request.toString();
      const message = getErrorMessage(error)
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
      // const message =
      //   (error.response &&
      //     error.response.data &&
      //     error.response.data.message) ||
      //   error.message ||
      //   error.toString() || error.request.toString();
      const message = getErrorMessage(error)
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);


    }
  }
);






export const assignAccountManagerSlice = createSlice({
  name: "assignAccountManager",
  initialState,
  reducers: {},
  extraReducers: {}
});
export const {

} = assignAccountManagerSlice.actions;
export const assignAccountManagerReducer = assignAccountManagerSlice.reducer;
