import { CleaningServices } from "@mui/icons-material";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createMandateService } from "../../services/subscription-service/create.mandate.service";
import { setMessage } from "../message";



const initialState = {
  fetchFrequencyData : [],
  isLoading : false,
  mandateType:[]
};

// 1)----------------------------------------------------------------------------------||

export const fetchFrequency = createAsyncThunk(
  "subcription/fetchFrequency",
  async (thunkAPI) => {
    try {
      const response = await createMandateService.fetchFrequency();
      return response;
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

export const fetchMandateType = createAsyncThunk(
  "subcription/fetchFrequency",
  async (thunkAPI) => {
    try {
      const response = await createMandateService.fetchFrequency();
      return response;
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

export const createMandateSubmission = createAsyncThunk(
  "createMandateSubmission/createMandateSubmission",
  async ( requestParam, thunkAPI) => {
    try {
      const response = await createMandateService.mandateSubmission(requestParam)
      return response.data;
    } catch (error) {
      const message =
      (error.response &&
        error.response.data &&
        error.response.data.detail) ||
      error.message ||
      error.toString() || error.request.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message); 
      
      
    }
  }
);



// viewSelected Slice----

const createMandateSlice = createSlice({
  name: "subcription",
  initialState,
  reducers: {
    // // 1)
    // changeTheMandateTableView: (reportsData, action) => {
    //   reportsData.uiState.allMandatesViewMaterialtable.tableShouldBeShown =
    //     action.payload;
    // },
    // // 2)
    // clearAllMandateListFiltered: (reportsData, action) => {
    //   reportsData.allMandateListFiltered = { records: [], count: 0 };
    // },
    // -----------------------------------------------------------------------||

  },
  extraReducers: {
    ///For Mandate Filter Data with Filters---
    [fetchFrequency.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.fetchFrequencyData = action.payload;
    },

    [fetchFrequency.pending]: (state) => {
      state.isLoading = true
      state.fetchFrequencyData = []
    },
    [fetchFrequency.rejected]: (state) => {
      state.isLoading = false;
      state.fetchFrequencyData = []
    },
    [fetchMandateType.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.fetchFrequencyData = action.payload;
    },

    [fetchMandateType.pending]: (state) => {
      state.isLoading = true
      state.fetchFrequencyData = []
    },
    [fetchMandateType.rejected]: (state) => {
      state.isLoading = false;
      state.fetchFrequencyData = []
    },
  },
});

// Exporting uiState actions
// export const {
//   changeTheMandateTableView,
//   clearAllMandateListFiltered,
// } = reportsDataSlice.actions;

// Exporting slice reducer
// export default reportsDataSlice.reducer;

export const createMandateReducer = createMandateSlice.reducer