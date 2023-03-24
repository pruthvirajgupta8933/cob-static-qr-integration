import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../../config";
import { DebitService } from "../../services/subscription-service/debit.service";
import { setMessage } from "../message";
import axios from "axios";



const initialState = {
  mandateHistory : [],
  isLoadingDebitHistory : false,
};

// 1)----------------------------------------------------------------------------------||

export const filterForAllDebitReportsSlice = createAsyncThunk(
  "userManagement/filterForAllDebitReports",
  async (data) => {
    const requestParam = data.page;
    const requestParam1 = data.size;
    const fromDate = data.fromDate
    const toDate = data.toDate
    const m_id = data.m_id
    const status = data.status
    const response = await axios
      .post(
        `${API_URL.filterDebitReport}?page=${requestParam}&size=${requestParam1}`,{fromDate,toDate,m_id,status})
      .catch((error) => {
        return error.response;
      });

    return response.data;
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