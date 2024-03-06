import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductPlan,subsCribedDetails, fetchSubscribedPlan, updateClientSubscribedDetails } from "../../services/merchant-service/prouduct-catalogue.service";
import { setMessage } from "../message";


const initialState = {
  SubscribedPlanData: [],
  productPlanData: [],
  clientSubscribeStatus: [],
  isLoading: false,
  clearWalletCommison:[]
}

export const merchantSubscribedPlanData = createAsyncThunk(
  "productCatalogue/merchantSubscribedPlanData",
  async (object, thunkAPI) => {
    console.log("object",object);
    try {
      const data = await fetchSubscribedPlan(object);
      return { data: data.data.data, commission_data: data.data.commission_data };
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
      return { data: data };
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
      // console.log(data)
      return { data: data?.data?.ProductDetail };
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


export const getSubscribedDetails=createAsyncThunk(
  "productCatalogue/getSubscribedDetails",
  async (thunkAPI) => {
   
    try {
      const data = await subsCribedDetails();
     
      return { data: data?.data?.result };
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
      state.walletCommission=0;
    },
    [merchantSubscribedPlanData.fulfilled]: (state, action) => {
      state.isLoading = false
      state.SubscribedPlanData = action.payload.data;
      state.walletCommission = action.payload.commission_data;
     
    },
    
    [merchantSubscribedPlanData.rejected]: (state) => {
      state.isLoading = false
      state.SubscribedPlanData = [];
      state.walletCommission=0;
    },

    [productPlanData.fulfilled]: (state, action) => {
      state.productPlanData = action.payload.data;
    },
    [updateSubscribeDetails.fulfilled]: (state, action) => {
      state.clientSubscribeStatus = action.payload?.data?.data;
    }


  },
});


export default productCatalogueSlice.reducer;
