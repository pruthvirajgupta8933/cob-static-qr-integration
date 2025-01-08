// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import approverDashboardService from "../../services/approver-dashboard/approverDashboard.service.js";
// import { setMessage } from "../message";

// const InitialState = {
//   businessCategoryType: [],
//   generalFormData: {
//     isFinalSubmit: false,
//   },
//   clientCodeList: [],
//   clientCodeByRole: {},
//   subMerchantList: {},
// };

// const approverDashboardSlice = createSlice({
//   name: "approverDashboard",
//   initialState: InitialState,
//   reducers: {
//     generalFormData: (state, action) => {
//       //  console.log(action.payload)
//       state.generalFormData = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(businessCategoryType.pending, (state) => {
//         state.businessCategoryType = [];
//       })

     
//       .addCase(fetchSubMerchant.rejected, (state, action) => {
//         state.subMerchantList = {
//           [action.meta.arg?.login_id]: { error: true },
//         };
//       });
//   },
// });

// export const { generalFormData } = approverDashboardSlice.actions;

// const { reducer } = approverDashboardSlice;
// export default reducer;
