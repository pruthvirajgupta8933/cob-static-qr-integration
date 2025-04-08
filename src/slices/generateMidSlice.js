import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMidDataByClientCode, fetchMidPayload, midCreateApi } from "../services/generate-mid/generate-mid.service";
import { setMessage } from "./message";
import { getErrorMessage } from "../utilities/errorUtils";




const initialState = {
  postdata: {},
  midPayload: {
    loading: false,
    data: {}
  },
  midData: {
    loading: false,
    data: {}
  }

};




export const createMidApi = createAsyncThunk(
  "mid/createMidApi",
  async (dataObj, thunkAPI) => {
    try {
      const response = await midCreateApi(dataObj);
      // console.log("rse", response);

      // thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      // console.log("message", message);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message); // Return the message here
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
      const message = getErrorMessage(error)
      // console.log("message", message);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message); // Return the message here
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
      const message = getErrorMessage(error)
      // console.log("message", message);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message); // Return the message here
    }
  }
);









export const generateMidSlice = createSlice({
  name: "mid",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(createMidApi.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createMidApi.fulfilled, (state) => {

      })
      .addCase(createMidApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchMidPayloadSlice.pending, (state) => {
        state.midPayload.loading = true;
        state.midPayload.data = {}
      })
      .addCase(fetchMidPayloadSlice.fulfilled, (state, action) => {
        state.midPayload.loading = false;
        state.midPayload.data = action.payload?.result;
      })
      .addCase(fetchMidPayloadSlice.rejected, (state, action) => {
        state.midPayload.loading = false;
        state.midPayload.error = action.error.message;
      })

      .addCase(fetchMidByClientCodeSlice.pending, (state) => {
        state.midData.loading = true;
        state.midData.data = {}
      })
      .addCase(fetchMidByClientCodeSlice.fulfilled, (state, action) => {
        state.midData.loading = false;
        state.midData.data = action.payload?.result;
      })
      .addCase(fetchMidByClientCodeSlice.rejected, (state, action) => {
        state.midData.loading = false;
        state.midData.error = action.error.message;
      });
  }
});

// export const {

// } = generateMidSlice.actions;
export const genreateMidReducer = generateMidSlice.reducer;
