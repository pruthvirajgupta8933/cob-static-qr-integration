import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {
    bankDetails,
    saveBasicDetails,
    saveBusinessDetails
} from "../../services/approver-dashboard/merchantReferralOnboard.service";


const sessionDataI = JSON.parse(sessionStorage.getItem("onboardingStatusByAdmin"))

const initialState = {
    merchantOnboardingProcess: {
        isOnboardStart: sessionDataI?.isOnboardStart ?? false,
        isOnboardComplete: sessionDataI?.isOnboardComplete ?? false,
        merchantLoginId: sessionDataI?.merchantLoginId ?? ""

    },
    merchantBasicDetails: {
        resp: {}
    },
    bankDetails: {
        resp: {}
    },
    businessDetails: {
        resp: {}
    },
    documentCenter: {
        resp: {}
    },
    referral: {}
}


export const saveMerchantBasicDetails = createAsyncThunk(
    "merchantReferralOnboardSlice/bank/saveMerchantBasicDetails",
    async (requestParam, thunkAPI) => {
        const response = await saveBasicDetails(requestParam)
            .catch((error) => {
                return error.response;
            });

        if(response.status!==200){
            return thunkAPI.rejectWithValue(response.data.detail)
        }else{
            return response.data;
        }

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
export const businessDetailsSlice = createAsyncThunk(
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
    reducers: {
        clearErrorMerchantReferralOnboardSlice : (state)=>{
            state.merchantBasicDetails.resp.error = false
            state.bankDetails.resp.error = false
            state.businessDetails.resp.error = false
        },
        updateOnboardingStatus : (state)=>{
            state.merchantOnboardingProcess.isOnboardComplete = true
            const sessionDataC = JSON.parse(sessionStorage.getItem("onboardingStatusByAdmin"))
            const onboardingStatusComplete = {
                merchantLoginId : sessionDataC?.merchantLoginId,
                isOnboardStart : sessionDataC?.isOnboardStart,
                isOnboardComplete:true
            }
            sessionStorage.setItem("onboardingStatusByAdmin",JSON.stringify(onboardingStatusComplete))
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveMerchantBasicDetails.pending, (state) => {
                // state.loading = 'loading';
            })
            .addCase(saveMerchantBasicDetails.fulfilled, (state, action) => {
                state.merchantBasicDetails.resp = action.payload.merchant_data
                if (action.payload.merchant_data?.status === "Activate") {
                    state.merchantOnboardingProcess.merchantLoginId = action.payload.merchant_data?.loginMasterId
                    state.merchantOnboardingProcess.isOnboardStart = true
                    const onboardingStatusByAdmin = {
                        merchantLoginId : action.payload.merchant_data?.loginMasterId,
                        isOnboardStart : true
                    }
                    sessionStorage.setItem("onboardingStatusByAdmin",JSON.stringify(onboardingStatusByAdmin))
                }
            })
            .addCase(saveMerchantBasicDetails.rejected, (state, action) => {
                // console.log("action",action)
                state.merchantBasicDetails.resp.error = true
                state.merchantBasicDetails.resp.errorMsg = action.payload
            })

            .addCase(saveBankDetails.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(saveBankDetails.fulfilled, (state, action) => {
                state.bankDetails.resp = action.payload;
            })
            .addCase(saveBankDetails.rejected, (state, action) => {
                state.loading = 'failed';
            })

            .addCase(businessDetailsSlice.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(businessDetailsSlice.fulfilled, (state, action) => {
                state.businessDetails.resp = action.payload;
            })
            .addCase(businessDetailsSlice.rejected, (state, action) => {
                state.loading = 'failed';
            })
    }
})

export const {clearErrorMerchantReferralOnboardSlice, updateOnboardingStatus } = merchantReferralOnboardSlice.actions
export default merchantReferralOnboardSlice.reducer