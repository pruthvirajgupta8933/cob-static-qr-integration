import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductPlan, fetchSubscribedPlan, updateClientSubscribedDetails } from "../../services/merchant-service/prouduct-catalogue.service";
import { setMessage } from "../message";


const initialState = {  
  SubscribedPlanData:[],
  productPlanData:[],
  clientSubscribeStatus:[],
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


  export const updateSubscribeDetails = createAsyncThunk(
    "productCatalogue/updateSubscribeDetails",
    async (object, thunkAPI) => {
      try {
        const data = await updateClientSubscribedDetails(object);
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


  export const productPlanData = createAsyncThunk(
    "productCatalogue/productPlanData",
    async (object, thunkAPI) => {
      try {
        const data = await fetchProductPlan(object);
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
      state.isLoading = false
      state.SubscribedPlanData = action.payload?.data?.data?.data;
    },
    [merchantSubscribedPlanData.rejected]: (state) => {
      state.isLoading = false
      state.SubscribedPlanData = [];
    },
    [productPlanData.fulfilled]:(state,action)=>{
      state.productPlanData = action.payload?.data?.data?.ProductDetail;
    },
    [updateSubscribeDetails.fulfilled]:(state,action)=>{
      // console.log("action",action)
      state.clientSubscribeStatus = action.payload?.data?.data;
    }


  },
});


export default productCatalogueSlice.reducer;
