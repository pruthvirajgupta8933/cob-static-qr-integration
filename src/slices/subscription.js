import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import subscriptionService from "../services/subscription";

const initialState = { subscription: {}, isLoading:false  }
const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  extraReducers: {
      
    [subscription.pending]: (state, action) => {
        state.isLoading = true;
    },
    [subscription.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.subscription = action.payload.data;
    },
    [subscription.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

const { reducerSubscription } = subscriptionSlice;
export default reducerSubscription;
