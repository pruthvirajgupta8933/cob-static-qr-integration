import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DebitService } from "../../services/subscription-service/debit.service";
import { setMessage } from "../message";



const initialState = {
  mandateHistory : [],
  isLoadingDebitHistory : false,
};

// 1)----------------------------------------------------------------------------------||

export const filterForAllDebitReportsSlice = createAsyncThunk(
  "userManagement/filterForAllDebitReports",
  async (data, thunkAPI) => {
    try {
      const response = await DebitService.filterForAllDebitReports(data);
      return response.data;
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

// export const filterMandateReportWithFilters = createAsyncThunk(
//   "reportsData/filterMandateReportWithFilters",
//   async (requestParam) => {
//     const response = await Axios.post(
//       `${config.backendUrl}/npci/filterMandateReport`,
//       requestParam
//     );
//     return response.data.records.filter(
//       (item) =>
//         item.bankName !== null && item.regestrationStatus !== "INITIATED"
//     );
//   }
// );




// viewSelected Slice----

const reportsDataSlice = createSlice({
  name: "userManagement",
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
    changeTheMandateTableView : (state) => {
      state.mandateHistory = []
    }
    
  },
  extraReducers: {
    ///For Mandate Filter Data with Filters---
    [filterForAllDebitReportsSlice.fulfilled]: (state, action) => {
      state.isLoadingDebitHistory = false;
      state.mandateHistory = action.payload;
    },

    [filterForAllDebitReportsSlice.pending]: (state) => {
      state.isLoadingDebitHistory = true
      state.mandateHistory = []
    },

    [filterForAllDebitReportsSlice.rejected]: (state) => {
      state.isLoadingDebitHistory = false;
      state.mandateHistory = []
    },
  },
});

// Exporting uiState actions
export const {
  changeTheMandateTableView,
  clearAllMandateListFiltered,
} = reportsDataSlice.actions;

// Exporting slice reducer
// export default reportsDataSlice.reducer;

export const DebitReportsDataReducer = reportsDataSlice.reducer