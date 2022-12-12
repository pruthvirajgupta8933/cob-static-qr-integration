import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import rateMappingService from "../services/rateMapping.service";


export const riskCategory = createAsyncThunk(
    "merchantzone/zoneDetail",
    async ( thunkAPI) => {
      try {
        const response = await rateMappingService.riskCategory();
        return response.data;
      } catch (error) {
        return error;
      }
    }
  );

  export const businessCategory = createAsyncThunk(
    " businessCategory/businessCategory",
    async (requestParams) => {
      try {
        const response = await rateMappingService.businessCategory(requestParams);
        return response.data;
      } catch (error) {
        return error;
      }
    }
  );

  export const templateRate = createAsyncThunk(
    "templateRate/templateRate",
    async (requestParams) => {
      try {
        const response = await rateMappingService.templateRate(requestParams);
        return response.data;
      } catch (error) {
        return error;
      }
    }
  );

  export const viewRateMap = createAsyncThunk(
    "templateRate/templateRate",
    async (requestParams) => {
      try {
        const response = await rateMappingService.viewRateMap(requestParams);
        return response.data;
      } catch (error) {
        return error;
      }
    }
  );