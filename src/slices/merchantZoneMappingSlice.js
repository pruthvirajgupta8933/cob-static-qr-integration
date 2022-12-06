import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../config";
import {
  axiosInstanceAuth,
 
} from "../utilities/axiosInstance";

const initialState = { 
    postdata:{}
};
  

export const riskCategory = createAsyncThunk(
    "riskCategory/riskCategory",
    async (requestParam) => {
      const response = await axiosInstanceAuth
        .put(`${API_URL.RISK_CATEGORY}`,  {
          headers: {
            // Authorization: ""
          },
        })
        .catch((error) => {
          return error.response;
        });
      // console.log(response)
      return response.data;

    }
  );

  export const zoneDetails = createAsyncThunk(
    "zoneDetails/zoneDetails",
    async (requestParam) => {
      const response = await axiosInstanceAuth
        .get(`${API_URL.ZONE_DETAILS}`,  {
          headers: {
            // Authorization: ""
          },
        })
        .catch((error) => {
          return error.response;
        });
      
      return response.data;
    }
  );
  export const zoneMaster = createAsyncThunk(
    "zoneMaster/zoneMaster",
    async (requestParam) => {
        
      const response = await axiosInstanceAuth
        .post(`${API_URL.ZONE_MASTER}`, requestParam, {
            headers: {
                // Authorization: ""
              },

         
        })
        .catch((error) => {
          return error.response;
        });
      // console.log(response)
      return response.data;
    }
  );
  export const zoneEmployee = createAsyncThunk(
    "zoneEmployee/zoneEmployee",
    async (requestParam) => {
      const response = await axiosInstanceAuth
        .post(`${API_URL.ZONE_EMPLOYEE}`, requestParam, {
            headers: {
                // Authorization: ""
              },

         
        })
        .catch((error) => {
          return error.response;
        });
      // console.log(response)
      return response.data;
    }
  );
  export const updateZoneData = createAsyncThunk(
    "updateZoneData/updateZoneData",
    async (requestParam) => {
        console.log(requestParam)
      const response = await axiosInstanceAuth
        .put(`${API_URL.UPDATE_ZONE_DATA}`, requestParam, {
            headers: {
                // Authorization: ""
              },

         
        })
        .catch((error) => {
          return error.response;
        });
      // console.log(response)
      return response.data;
    }
  );
  export const getZoneInfo = createAsyncThunk(
    "getZoneInfo/getZoneInfo",
    async (requestParam) => {
        
      const response = await axiosInstanceAuth
        .post(`${API_URL.GET_ZONE_INFO}`, requestParam, {
            headers: {
                // Authorization: ""
              },

         
        })
        .catch((error) => {
          return error.response;
        });
      // console.log(response)
      return response.data;
    }
  );
  ////////////////////////////////////////////////// Rate mapping api start here

  export const merchantZoneMappingSlice = createSlice({
    name: "merchnatzone",
    initialState,
    reducers: {},
     
    extraReducers: {
      [riskCategory.pending]: (state, action) => {
        state.status = "pending";
        
      },
      [riskCategory.fulfilled]: (state, action) => {
       

      },
      [riskCategory.rejected]: (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      },
    
    }
  });
  export const {
   
  } = merchantZoneMappingSlice.actions;
  export const merchantZoneMappingReducer = merchantZoneMappingSlice.reducer;
  