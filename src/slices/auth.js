import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";


import AuthService from "../services/auth.service";
import { useHistory } from "react-router-dom";

const user = JSON.parse(localStorage.getItem("user"));


export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, thunkAPI) => {
    try {
      const response = await AuthService.register(username, email, password);
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

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, thunkAPI) => {
    try {
      console.log("auth",username);
      const data = await AuthService.login(username, password);
      return { user: data };
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

export const logout = createAsyncThunk("auth/logout", async () => {
  await AuthService.logout();
  
});





// Home , successTxnSummary

export const successTxnSummary = createAsyncThunk(
  "auth/successTxnSummary",
  async (object, thunkAPI) => {
    try {
      console.log(object);
      const {fromDate,toDate,clientCode} = object;
      const response = await AuthService.successTxnSummary(fromDate,toDate,clientCode );
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


const initialState = user && user.loginStatus
  ? { isLoggedIn: true, user,isValidUser:'',successTxnsumry:[] }
  : { isLoggedIn: false, user: null,isValidUser:'',successTxnsumry:[] };



const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: {
    [register.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
    },
    [register.rejected]: (state, action) => {
      state.isLoggedIn = false;
    },
    [successTxnSummary.fulfilled]: (state, action) => {
      state.successTxnsumry = action.payload;
    },
    [successTxnSummary.rejected]: (state, action) => {
      //code 
    },
    [login.fulfilled]: (state, action) => {
      let loggedInStatus = false;
      let isValidData ='';

      if(action.payload.user && action.payload.user!==null){
        const loginState = action.payload.user.loginStatus;
        loggedInStatus = false;
          if(loginState==="Activate"){
              loggedInStatus = true;
              isValidData = 'Yes';
            }
        }else{
                loggedInStatus = false;
                isValidData = 'No';
        }

      state.isLoggedIn = loggedInStatus;
      state.user = action.payload.user;
      state.isValidUser = isValidData;
    },
    [login.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      state.isValidUser = 'No';
    },
    [logout.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      state.isValidUser = '';
    },
  },
});

const { reducer } = authSlice;
export default reducer;
