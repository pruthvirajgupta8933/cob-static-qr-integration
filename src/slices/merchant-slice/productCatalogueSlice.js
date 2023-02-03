import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSubscribedPlan } from "../../services/merchant-service/prouduct-catalogue.service";
import { setMessage } from "../message";


const initialState = { 
  unPaidSubscribedPlan: [], 
  SubscribedPlanData:[],
  isLoading:false  }

export const merchantSubscribedPlanData = createAsyncThunk(
    "productCatalogue/merchantSubscribedPlanData",
    async (object, thunkAPI) => {
      try {
        const data = await fetchSubscribedPlan(object);
        return { data : data };
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


const productCatalogueSlice = createSlice({
  name: "productCatalogue",
  initialState,
  extraReducers: {
    [merchantSubscribedPlanData.pending]: (state) => {
      state.isLoading = true
      state.SubscribedPlanData = [];
    },
    [merchantSubscribedPlanData.fulfilled]: (state, action) => {
      // console.log(action.payload)
      state.isLoading = false
      state.SubscribedPlanData = action.payload?.data?.data?.data;
    },
    [merchantSubscribedPlanData.rejected]: (state) => {
      state.isLoading = false
      state.SubscribedPlanData = [];
    }
  },
});


export default productCatalogueSlice.reducer;
