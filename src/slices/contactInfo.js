//-----------------For Saving the Merchant Data (Contact Info) -----------------------
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../config";
import axios from "axios";


const ContactInfo = {

    DataUpdateResponse: {         
        status: "",
        message: ""
       }   
  };


    //--------------For Saving the Merchant Data Successfully (Contact Info) ---------------------
    export const updateContactInfo = createAsyncThunk(
        "UpdateContactInfo/updateContactInfo",
        async (requestParam) => {
          const response = await axios.put(
            `${API_URL.Save_General_Info}`,
            requestParam,
            {
              headers: {
                // Authorization: ""
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



      const ContactInfoSlice = createSlice({
        name: "ContactInfo",
        initialState: ContactInfo,
        reducers: {},
        extraReducers: {
            ////////////////////////////////////////////////////
        [updateContactInfo.pending]: (state, action) => {
            state.status = "pending";
          },
          [updateContactInfo.fulfilled]: (state, action) => {
            state.DataUpdateResponse = action.payload;
          },
          [updateContactInfo.rejected]: (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
          },
      
        },
      });
      
      export default ContactInfoSlice.reducer;
  
  

