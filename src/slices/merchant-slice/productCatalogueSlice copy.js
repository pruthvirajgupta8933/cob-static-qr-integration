import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductPlan,subscribedDetails, fetchSubscribedPlan, updateClientSubscribedDetails, productDetailsUrl,
  subscribedPlanDetailsUrl,
  productSubDetailsUrl,
  subscribeFetchAppAndPlanUrl
 } from "../../services/merchant-service/prouduct-catalogue.service";
import { setMessage } from "../message";


const initialState = {
  SubscribedPlanData: [],
  productPlanData: [],
  clientSubscribeStatus: [],
  isLoading: false,
  errorState:false,
  productDetailsData:[],
  productSubDetails:[],
  
}

export const merchantSubscribedPlanData = createAsyncThunk(
  "productCatalogue/merchantSubscribedPlanData",
  async (object, thunkAPI) => {
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
      const data = await subscribedDetails();
     
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

export const productDetails=createAsyncThunk(
  "productCatalogue/productDetails",
  async (requestParam,thunkAPI) => {
   
    try {
      const response = await productDetailsUrl(requestParam);
     
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






export const subscribedPlanDetails = createAsyncThunk(
    "productCatalogue/subscribedPlanDetails",
    async (requestParam, thunkAPI) => {
  
      try {
        const response = await subscribedPlanDetailsUrl(requestParam);
       return response.data;
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString() || error.request.toString();
        thunkAPI.dispatch(setMessage(message));
        return thunkAPI.rejectWithValue(message);
  
  
      }
    }
  );

  export const productSubDetails = createAsyncThunk(
    "productCatalogue/productSubDetails",
    async (id, thunkAPI) => {
  
      try {
        const response = await productSubDetailsUrl(id);
       
        return response.data;
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString() || error.request.toString();
        thunkAPI.dispatch(setMessage(message));
        return thunkAPI.rejectWithValue(message);
  
  
      }
    }
  );

  export const subscribeFetchAppAndPlan = createAsyncThunk(
    "productCatalogue/subscribeFetchAppAndPlan",
    async (requestParam, thunkAPI) => {
  
      try {
        const response = await subscribeFetchAppAndPlanUrl(requestParam);
       return response.data;
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString() || error.request.toString();
        thunkAPI.dispatch(setMessage(message));
        return thunkAPI.rejectWithValue(message);
  
  
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
      state.errorState=true
      state.SubscribedPlanData = [];
      state.walletCommission=0;
    },

    [productPlanData.fulfilled]: (state, action) => {
      state.productPlanData = action.payload.data;
    },
    [updateSubscribeDetails.fulfilled]: (state, action) => {
      state.clientSubscribeStatus = action.payload?.data?.data;
    },

    [productDetails.pending]: (state) => {
      state.isLoading=true
      
    },
    [productDetails.fulfilled]: (state, action) => {
      state.productDetailsData=action.payload.ProductDetail
      state.isLoading=false

     
    },
    
    [productDetails.rejected]: (state) => {
      state.isLoading=false
    },

    [productSubDetails.pending]:(state)=>{
      state.isLoading=true


    },
    [productSubDetails.fulfilled]:(state,action)=>{
     state.productSubDetails=action.payload.ProductDetail
     state.isLoading=false
      

    },
    [productSubDetails.rejected]:(state)=>{
      state.isLoading=false

    }

    

},



});


export default productCatalogueSlice.reducer;
