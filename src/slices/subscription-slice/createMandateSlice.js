import { CleaningServices } from "@mui/icons-material";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createMandateService } from "../../services/subscription-service/create.mandate.service";
import { setMessage } from "../message";
import { kycValidatorAuth } from "../../utilities/axiosInstance";
import subAPIURL from "../../config";


const initialState = {
  fetchFrequencyData : [],
  isLoading : false,
  mandateType:[],
  createMandate: {
    formData: {
      firstForm : {},
      secondForm: {},
      thirdForm: {},

    }

  }
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
  "subcription/fetchMandateType",
  async (thunkAPI) => {
    try {
      const response = await createMandateService.fetchMandateType();
      
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


export const fetchMandatePurpose = createAsyncThunk(
  "subcription/fetchMandatePurpose ",
  async (thunkAPI) => {
    try {
      const response = await createMandateService.fetchMandatePurpose();
     
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


export const fetchRequestType = createAsyncThunk(
  "subcription/fetchMandatePurpose ",
  async (thunkAPI) => {
    try {
      const response = await createMandateService.fetchrequestType();
     
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


export const fetchMandateBankName = createAsyncThunk(
  "subcription/fetchBankName ",
  async (thunkAPI) => {
    try {
      const response = await createMandateService.fetchBankName();
     
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







// viewSelected Slice----

const createMandateSlice = createSlice({
  name: "subcription",
  initialState,
  reducers: {
    saveFormFirstData: (state, action) => {
      
      state.createMandate.formData.firstForm = action?.payload?.newValues;
     
       },

       saveFormSecondData: (state, action) => {
       
        state.createMandate.formData.secondForm = action?.payload?.values;
       
         },
        saveFormThirdData: (state, action) => {
          
          state.createMandate.formData.thirdForm = action?.payload?.values;
         
           },
       

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

// export const createMandateReducer = createMandateSlice.reducer

export const {
  saveFormFirstData,
  saveFormSecondData,
  saveFormThirdData
  
} = createMandateSlice.actions;
export const createMandateReducer = createMandateSlice.reducer;