import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import transactionsService from "../services/b2bServices/transactions.service";
import axios from "axios";
import { B2B_URL } from "../config";



const initialState = { 



}


export const challanTransactions = createAsyncThunk(
    "challan/challanTransactions",
    async (data) => {
      const requestParam = data.page;
      const requestParam1 = data.page_size;
      const from_date = data.from_date
      const to_date = data.to_date
      const client_code = data.client_code
      const response = await axios
        .post(
          `${B2B_URL.challanTransaction}/?page_size=${requestParam1}&page=${requestParam}&order_by=id`,{from_date,to_date,client_code})
        .catch((error) => {
          return error.response;
        });
  
      return response.data;
    }
  );


  export const challanTransactionSlice = createSlice({
    name: "challan",
    initialState,
    reducers: {},
     
    extraReducers: {
      [challanTransactions.pending]: (state, action) => {
        state.status = "pending";
        
      },
      [challanTransactions.fulfilled]: (state, action) => {
       

      },
      [challanTransactions.rejected]: (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      },
      // ------------------------------------ For Comments ---------------------
    
    }
  });
  // export const { } = challanTransactionSlice.actions;
  export const challanReducer = challanTransactionSlice.reducer;
  

  
  
  
  
  

  