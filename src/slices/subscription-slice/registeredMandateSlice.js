import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config";


const initialState = {
  isLoadingMandateHistory : false,
};

// 1)----------------------------------------------------------------------------------||

export const fetchFilterForAllMandatesReportsSlice = createAsyncThunk(
  "userManagement/filterForAllMandatesReports",
  async (data) => {
    const requestParam = data.page;
    const requestParam1 = data.size;
    const fromDate = data.fromDate
    const toDate = data.toDate
    const m_id = data.m_id
    const status = data.status
    const mandatecategorycode = data.mandatecategorycode
    const aggregatecode = data.aggregatecode
    const merchantcode = data.merchantcode

    const response = await axios
      .post(
        `${API_URL.filterMandateReport}?page=${requestParam}&size=${requestParam1}`,{fromDate,toDate,m_id,status,mandatecategorycode,aggregatecode,merchantcode})
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);





// viewSelected Slice----

const reportsDataSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {  },
  extraReducers: {
    ///For Mandate Filter Data with Filters---
    [fetchFilterForAllMandatesReportsSlice.fulfilled]: (state, action) => {
      state.isLoadingMandateHistory = false;
     
    },

    [fetchFilterForAllMandatesReportsSlice.pending]: (state) => {
      state.isLoadingMandateHistory = true
     
    },

    [fetchFilterForAllMandatesReportsSlice.rejected]: (state) => {
      state.isLoadingMandateHistory = false;
    
    },
  },
});

// Exporting uiState actions
export const {
} = reportsDataSlice.actions;

// Exporting slice reducer
// export default reportsDataSlice.reducer;

export const reportsDataReducer = reportsDataSlice.reducer