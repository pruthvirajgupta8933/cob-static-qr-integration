import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import API_URL from "../config";
import zoneService from "../services/merchantZoneMapping.service";

import {
  axiosInstanceJWT,
 
} from "../utilities/axiosInstance";


const initialState = { 
    postdata:{},
   
};


export const zoneDetail = createAsyncThunk(
  "merchantzone/zoneDetail",
  async ( thunkAPI) => {
    try {
      const response = await zoneService.zoneDetails();
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const zoneMaster = createAsyncThunk(
  "zoneMaster/zoneMaster",
  async ( requestParam) => {
    try {
      const response = await zoneService.zoneMasters(requestParam)
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const zoneEmployee= createAsyncThunk(
  "zoneEmployee/zoneEmployee",
  async ( requestParam) => {
    try {
      const response = await zoneService.zoneEmployee(requestParam)
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const updateZoneData= createAsyncThunk(
  "zoneEmployee/zoneEmployee",
  async ( requestParam) => {
    
    try {
      const response = await zoneService.updateZoneData(requestParam)
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const getZoneInfo= createAsyncThunk(
  "zoneEmployee/zoneEmployee",
  async ( requestParam) => {
    
    try {
      const response = await zoneService.getZoneInfo(requestParam)
      return response.data;
    } catch (error) {
      return error;
    }
  }
);
export const riskCategory = createAsyncThunk(
    "riskCategory/riskCategory",
    async (requestParam) => {
      const response = await axiosInstanceJWT
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


export const forSavingComments = createAsyncThunk(
    "merchnatzone/forSavingComments",
    async (requestParam) => {
        
      const response = await axiosInstanceJWT
        .post(`${API_URL.SAVE_COMMENTS}`, requestParam, {
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


  export const forGettingCommentList = createAsyncThunk(
    "merchnatzone/forGettingCommentList",
    async (requestParam) => {
        
      const response = await axiosInstanceJWT
        .post(`${API_URL.VIEW_COMMENTS_LIST}`, requestParam, {
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



  export const updatedCommentList = createAsyncThunk(
    "merchnatzone/updatedCommentList",
    async (requestParam) => {
        
      const response = await axiosInstanceJWT
        .post(`${API_URL.COMMENTS_BOX}`, requestParam, {
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
      // ------------------------------------ For Comments ---------------------


      [forSavingComments.pending]: (state, action) => {
        state.status = "pending";
        
      },
      [forSavingComments.fulfilled]: (state, action) => {
        // state.comments = action.payload

       

      },
      [riskCategory.rejected]: (state, action) => {
        forSavingComments = "failed";
        state.error = action.error.message;
      }, 
      
    
    }
  });
  export const {
   
  } = merchantZoneMappingSlice.actions;
  export const merchantZoneMappingReducer = merchantZoneMappingSlice.reducer;
  