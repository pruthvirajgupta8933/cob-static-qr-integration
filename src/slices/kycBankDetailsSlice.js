import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../config";
import axios from "axios";

const initialState = {
    kycBankNames :[],
   saveMerchantBankDetais:[]
 }



 //--------------KYC BANK NAMES --------------------- //
 export const kycBankNames = createAsyncThunk(
    "kyc/kycBankNames",
    async (requestParam) => {
      const response = await axios.get(
        `${API_URL.GET_ALL_BANK_NAMES}`,
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
  

//----For Saving Merchant Bank Details-----------------// 
  export const saveMerchantBankDetais= createAsyncThunk(
    "kyc/saveMerchantBankDetais",
    async (requestParam) => {
      const response = await axios.put(
        `${API_URL.Save_Settlement_Info}`,
        requestParam,

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
//--------------------------------------------------

 export const bankDetailsSlice = createSlice({
    name: 'bankDetails',
    initialState,
    reducers:{
      getBankNames: (state)=>{
        state.kycBankNames = []
      },
      savingMerchantBankDetails : (state)=>{
        state.saveMerchantBankDetais=[]
      }
      
    },
})


export const {getBankNames,savingMerchantBankDetails } = bankDetailsSlice.actions
export const bankDetailsReducer = bankDetailsSlice.reducer