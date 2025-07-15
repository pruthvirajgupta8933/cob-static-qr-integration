import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  deactivateSubMerchant,
  fetchMidDataByClientCode,
  fetchMidPayload,
  midCreateApi,
  reactivateSubMerchant,
  subMerchantDetails,
  updateSubmerchantApi
} from "../services/generate-mid/generate-mid.service";
import { setMessage } from "./message";
import { getErrorMessage } from "../utilities/errorUtils";

// Initial state
const initialState = {
  postdata: {},
  midPayload: {
    loading: false,
    data: {},
    error: null
  },
  midData: {
    loading: false,
    data: {},
    error: null
  },
  midFetchDetails: {
    loading: false,
    error: null,
    message: "",
    subMerchantData: null,
  },
};

// Async Thunks
export const createMidApi = createAsyncThunk(
  "mid/createMidApi",
  async (dataObj, thunkAPI) => {
    try {
      const response = await midCreateApi(dataObj);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchMidByClientCodeSlice = createAsyncThunk(
  "mid/fetchMidByClientCodeSlice",
  async (dataObj, thunkAPI) => {
    try {
      const response = await fetchMidDataByClientCode(dataObj);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchMidPayloadSlice = createAsyncThunk(
  "mid/fetchMidPayloadSlice",
  async (dataObj, thunkAPI) => {
    try {
      const response = await fetchMidPayload(dataObj);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const subMerchantFetchDetailsApi = createAsyncThunk(
  "mid/subMerchantFetchDetailsApi",
  async (dataObj, thunkAPI) => {
    try {
      const response = await subMerchantDetails(dataObj);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.error || getErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deactivateSubMerchantApi = createAsyncThunk(
  "mid/deactivateSubMerchantApi",
  async (dataObj, thunkAPI) => {
    try {
      const response = await deactivateSubMerchant(dataObj);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const reactivateSubMerchantApi = createAsyncThunk(
  "mid/reactivateSubMerchantApi",
  async (dataObj, thunkAPI) => {
    try {
      const response = await reactivateSubMerchant(dataObj);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateSubmerchant = createAsyncThunk(
  "mid/updateSubmerchant",
  async (dataObj, thunkAPI) => {
    try {
      const response = await updateSubmerchantApi(dataObj);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);






// Slice
export const generateMidSlice = createSlice({
  name: "mid",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // createMidApi
      .addCase(createMidApi.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createMidApi.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createMidApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // fetchMidPayloadSlice
      .addCase(fetchMidPayloadSlice.pending, (state) => {
        state.midPayload.loading = true;
        state.midPayload.data = {};
        state.midPayload.error = null;
      })
      .addCase(fetchMidPayloadSlice.fulfilled, (state, action) => {
        state.midPayload.loading = false;
        state.midPayload.data = action.payload?.result || {};
      })
      .addCase(fetchMidPayloadSlice.rejected, (state, action) => {
        state.midPayload.loading = false;
        state.midPayload.error = action.error.message;
      })

      // fetchMidByClientCodeSlice
      .addCase(fetchMidByClientCodeSlice.pending, (state) => {
        state.midData.loading = true;
        state.midData.data = {};
        state.midData.error = null;
      })
      .addCase(fetchMidByClientCodeSlice.fulfilled, (state, action) => {
        state.midData.loading = false;
        state.midData.data = action.payload?.result || {};
      })
      .addCase(fetchMidByClientCodeSlice.rejected, (state, action) => {
        state.midData.loading = false;
        state.midData.error = action.error.message;
      })

      // subMerchantFetchDetailsApi
      .addCase(subMerchantFetchDetailsApi.pending, (state) => {
        state.midFetchDetails.loading = true;
        state.midFetchDetails.error = null;
        state.midFetchDetails.subMerchantData = null;

      })
      .addCase(subMerchantFetchDetailsApi.fulfilled, (state, action) => {
        state.midFetchDetails.loading = false;

        state.midFetchDetails.subMerchantData = action.payload || null;
      })
      .addCase(subMerchantFetchDetailsApi.rejected, (state, action) => {
        state.midFetchDetails.loading = false;
        state.midFetchDetails.error = action.error.message;
      });
  }
});

// Export reducer
export const genreateMidReducer = generateMidSlice.reducer;
