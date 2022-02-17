import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import ProfileService from "../services/profile.service";


export const createClientProfile = createAsyncThunk(
  "profile/createClientProfile",
  async (object, thunkAPI) => {
    try {
      // console.log({ fromdate, todate, clientcode });
      const response = await ProfileService.createClintCode(object );
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

const initialState = { createClientProfile: {},updateClientProfile:{} ,isLoading:false }
const profileSlice = createSlice({
  name: "profile",
  initialState,
  extraReducers: {
    [createClientProfile.pending]: (state, action) => {
        state.isLoading = true;
      },
    [createClientProfile.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.createClientProfile = action.payload.data;
    },
    [createClientProfile.rejected]: (state, action) => {
      state.isLoading = false;
    },
   
  },
});

const { reducerProfile } = profileSlice;
export default reducerProfile;
