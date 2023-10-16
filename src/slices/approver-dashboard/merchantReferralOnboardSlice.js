import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bankDetails, saveBasicDetails, saveBusinessDetails } from "../../services/approver-dashboard/merchantReferralOnboard.service";

const initialState = {

    merchantOnboardingProcess: {
        isOnboardStart: false,
        isOnboardComplete: false,
        merchantLoginId: ""

    },
    merchantBasicDetails: {},
    bankDetails: {},
    bussinessDetails: {},
    documentCenter: {},
    referral: {}
}


export const saveMerchantBasicDetails = createAsyncThunk(
    "merchantReferralOnboardSlice/bank/saveMerchantBasicDetails",
    async (requestParam) => {
        const response = await saveBasicDetails(requestParam)
            .catch((error) => {
                return error.response;
            });
        return response.data;
    }
);



export const saveBankDetails = createAsyncThunk(
    "merchantReferralOnboardSlice/bank/saveBankDetails",
    async (requestParam) => {
        const response = await bankDetails(requestParam)
            .catch((error) => {
                return error.response;
            });
        return response.data;
    }
);
export const businessDetails = createAsyncThunk(
    "merchantReferralOnboardSlice/bank/saveBusinessDetails",
    async (requestParam) => {
        const response = await saveBusinessDetails(requestParam)
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
            .addCase(saveMerchantBasicDetails.pending, (state) => {
                state.loading = 'loading';
                // console.log("pending")
            })
            .addCase(saveMerchantBasicDetails.fulfilled, (state, action) => {
                // BMO - bank merchant onboard basic details
                sessionStorage.setItem("BMO-basic-details", JSON.stringify(action.payload.merchant_data))
                state.merchantBasicDetails = action.payload.merchant_data
                state.merchantOnboardingProcess.merchantLoginId = action.payload.merchant_data?.loginMasterId
                state.merchantOnboardingProcess.isOnboardStart = true
            })
            .addCase(saveMerchantBasicDetails.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message;
                console.log("fail")
            })
            .addCase(saveBankDetails.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(saveBankDetails.fulfilled, (state, action) => {
                sessionStorage.setItem("BMO-bank-details", JSON.stringify(action.payload))
                state.loading = 'succeeded';
                state.bankDetails = action.payload;
                state.error = null;
                // console.log("success")
            })
            .addCase(saveBankDetails.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message;
                console.log("fail")

            })

            .addCase(businessDetails.pending, (state) => {
                state.loading = 'loading';
                console.log("pending")
            })
            .addCase(businessDetails.fulfilled, (state, action) => {
                sessionStorage.setItem("BMO-business-details", JSON.stringify(action.payload))
                state.loading = 'succeeded';
                state.entities = action.payload;
                state.error = null;
                console.log("success")
            })
            .addCase(businessDetails.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message;
                console.log("fail")
            })

    }
})


export default merchantReferralOnboardSlice.reducer