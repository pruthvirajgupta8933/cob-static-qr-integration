import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  fromDate: moment().format("YYYY-MM-DD"),
  toDate: moment().format("YYYY-MM-DD"),
};

const dateFilterSlice = createSlice({
  name: "dateFilter",
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.fromDate = action.payload.fromDate;
      state.toDate = action.payload.toDate;
    },
    resetDateRange: (state) => {
      state.fromDate = moment().format("YYYY-MM-DD");
      state.toDate = moment().format("YYYY-MM-DD");
    },
  },
});

export const { setDateRange, resetDateRange } = dateFilterSlice.actions;
// export default dateFilterSlice.reducer;

export const dateFilterSliceReducer = dateFilterSlice.reducer;
