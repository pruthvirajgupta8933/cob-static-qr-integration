import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  fromDate: moment().format("YYYY-MM-DD"),
  toDate: moment().format("YYYY-MM-DD"),
  dateRange: "today",
  graphSelectedOption: ["hourly"],
  graphSelectedCurrentOption: "hourly"
};

const dateFilterSlice = createSlice({
  name: "dateFilter",
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.fromDate = action.payload.fromDate;
      state.toDate = action.payload.toDate;
      state.dateRange = action.payload.dateRange;
    },
    setGraphFilterOption: (state, action) => {
      state.graphSelectedOption = action.payload.duration
    },
    setSeletedGraphOption: (state, action) => {
      state.graphSelectedCurrentOption = action.payload.currentFilter
    },
    resetDateRange: (state) => {
      state.fromDate = moment().format("YYYY-MM-DD");
      state.toDate = moment().format("YYYY-MM-DD");
    },
  },
});

export const { setDateRange, resetDateRange, setGraphFilterOption, setSeletedGraphOption } = dateFilterSlice.actions;
// export default dateFilterSlice.reducer;

export const dateFilterSliceReducer = dateFilterSlice.reducer;
