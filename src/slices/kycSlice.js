import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../config";
import axios from "axios";

const initialState = {
    businessType:[],
    busiCategory:[],
    platformType:[],
    collectionFrequency:[],
    collectionType:[],
    saveBusinessInfo:[],
    businessOverviewState:[],
    saveMerchantInfo:[],
    documentsUpload:[],
    merchantInfo:[]
   
 }

//--------------Kyc BusinessType get api (BusinessOverview Tab)---------------------
 export const businessType = createAsyncThunk(
    "kyc/businessType",
    async (requestParam) => {
      const response = await axios.get(
        `${API_URL.Business_type}`,
        {
          headers: {
            
          }
        }
      )
      .catch((error) => {
        return error.response;
      });
      // console.log(response)
      return response.data;
    }
  );
  ///////////////////////// For business category api
  export const busiCategory= createAsyncThunk(
    "kyc/busiCategory",
    async (requestParam) => {
      const response = await axios.get(
        `${API_URL.Business_Category}`,
        {
          headers: {
           
          }
        }
      )
      .catch((error) => {
        return error.response;
      });
      // console.log(response)
      return response.data;
    }
  );
  ////////////////////////////////////////////////// For platform
  export const platformType= createAsyncThunk(
    "kyc/platformType",
    async (requestParam) => {
      const response = await axios.get(
        `${API_URL.Platform_type}`,
        {
          headers: {
           
          }
        }
      )
      .catch((error) => {
        return error.response;
      });
      // console.log(response)
      return response.data;
    }
  );

  /////////////////////////////////////////////// For collection frequency
  export const collectionFrequency= createAsyncThunk(
    "kyc/platformType",
    async (requestParam) => {
      const response = await axios.get(
        `${API_URL.Collection_frequency}`,
        {
          headers: {
           
          }
        }
      )
      .catch((error) => {
        return error.response;
      });
      // console.log(response)
      return response.data;
    }
  );

////////////////////////////////////////////////Get all collection type
export const collectionType= createAsyncThunk(
    "kyc/collectionType",
    async (requestParam) => {
      const response = await axios.get(
        `${API_URL. Get_ALL_Collection_Type}`,
        {
          headers: {
           
          }
        }
      )
      .catch((error) => {
        return error.response;
      });
     
      return response.data;
    }
  );
  //////////////////////////////////////////////////// Put api for save business info
  export const saveBusinessInfo= createAsyncThunk(
    "kyc/collectionType",
    async (requestParam) => {
      const response = await axios.put(
        `${API_URL.save_Business_Info}`,
        requestParam
     
      )
      .catch((error) => {
        return error.response;
      });
     
      return response.data;
    }
  );

  /////////////////////////////// Get APi for BusinessDetails Tab(For state)
  export const businessOverviewState= createAsyncThunk(
    "kyc/businessOverviewState",
    async (requestParam) => {
      const response = await axios.get(
        `${API_URL.Business_overview_state}`,
        {
          headers: {
           
          }
        }
      )
      .catch((error) => {
        return error.response;
      });
     
      return response.data;
    }
  );

  ///////////////////////////////////// Put APi for SAVE_MERCHANT_INFO (BusinessDetails Tab)

  export const saveMerchantInfo= createAsyncThunk(
    "kyc/collectionType",
    async (requestParam) => {
      const response = await axios.put(
        `${API_URL.SAVE_MERCHANT_INFO}`,
        requestParam
     
      )
      .catch((error) => {
        return error.response;
      });
     
      return response.data;
    }
  );
/////////////////////////////// Get api for Documents Uploads Tab

export const documentsUpload= createAsyncThunk(
    "kyc/documentsUpload",
    async (requestParam) => {
      const response = await axios.get(
        `${API_URL.DocumentsUpload}`,
        {
          headers: {
           
          }
        }
      )
      .catch((error) => {
        return error.response;
      });
     
      return response.data;
    }
  );

  ////////////////////////////////// .Upload_Merchant_document//////////

  export const merchantInfo= createAsyncThunk(
    "kyc/merchantInfo",
    async (requestParam) => {
      const response = await axios.post(
        `${API_URL.Upload_Merchant_document}`,
        requestParam
      )
      .catch((error) => {
        return error.response;
      });
     
      return response.data;
    }
  );

 export const kycSlice = createSlice({
    name: 'kyc',
    initialState,
    reducers:{
      getBusinessType : (state)=>{
        state.businessType= []
      },
      getBusinessCategory : (state)=>{
        state.busiCategory = []
      },
    //   saveKycDetails : (state)=>{
    //     state.saveKycDetails=[]
    //   }
      
    },
})


export const {getBusinessType,getBusinessCategory } = kycSlice.actions
export const kycReducer = kycSlice.reducer