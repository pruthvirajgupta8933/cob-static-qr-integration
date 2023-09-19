import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bankDetails, saveBasicDetails } from "../../services/approver-dashboard/merchantReferralOnboard.service";

const initialState = {
    merchantRegister: {},
    bankDetails: {},
    bussinessDetails: {},
    documentCenter: {}
}


export const saveMerchantBasicDetails = createAsyncThunk(
    "merchantReferralOnboardSlice/saveMerchantBasicDetails",
    async (requestParam) => {
        const response = await saveBasicDetails(requestParam)
            .catch((error) => {
                return error.response;
            });
        return response.data;
    }
);



export const saveBankDetails = createAsyncThunk(
    "merchantReferralOnboardSlice/saveBankDetails",
    async (requestParam) => {
        const response = await bankDetails(requestParam)
            .catch((error) => {
                return error.response;
            });
        return response.data;
    }
);



export const merchantReferralOnboardSlice = createSlice({
    name: "merchantReferralOnboardSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveBankDetails.pending, (state) => {
                state.loading = 'loading';
                console.log("pending")
            })
            .addCase(saveBankDetails.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.entities = action.payload;
                state.error = null;
                console.log("success")
            })
            .addCase(saveBankDetails.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message;
                console.log("fail")

            })
            .addCase(saveMerchantBasicDetails.pending, (state) => {
                state.loading = 'loading';
                console.log("pending")
            })
            .addCase(saveMerchantBasicDetails.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.entities = action.payload;
                state.error = null;
                console.log("success")
            })
            .addCase(saveMerchantBasicDetails.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message;
                console.log("fail")

            })

    }
})


export default merchantReferralOnboardSlice.reducer