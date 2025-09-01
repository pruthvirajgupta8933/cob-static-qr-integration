import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  currenTab: "1",
  autoMoveTab: {
    NotFilledKYC: "1",
    PendindKyc: "2",
    PendingVerification: "3",
    VerifiedMerchant: "4",
    ApprovedMerchant: "5",
    RejectedKYC: "6"
  }
}



export const merchantListSlice = createSlice({
  name: "merchantList",
  initialState,
  reducers: {
    merchantTab: (state, action) => {
      state.currenTab = action.payload;
      //  console.log(action.payload,"here")
    },
  },

});

export const {
  merchantTab

} = merchantListSlice.actions;
export const merchantListReducer = merchantListSlice.reducer;

