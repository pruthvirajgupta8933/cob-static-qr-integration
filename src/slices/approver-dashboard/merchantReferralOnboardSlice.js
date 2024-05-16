import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    bankDetails,
    saveBasicDetails,
    saveBusinessDetails,
    updateBasicDetails,
    fetchPerentTypeMerchantData,
    getAllZoneCode
} from "../../services/approver-dashboard/merchantReferralOnboard.service";

import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import API_URL from "../../config";

const sessionDataI = JSON.parse(localStorage.getItem("onboardingStatusByAdmin"))
const initialState = {
    isLoading: false,
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

    refrerChiledList: {
        resp: {}
    },
    referral: {},

    getAllZoneCode: {
        zoneCode: {}

    }
}


export const saveMerchantBasicDetails = createAsyncThunk(
    "merchantReferralOnboardSlice/bank/saveMerchantBasicDetails",
    async (requestParam, thunkAPI) => {
        const response = await saveBasicDetails(requestParam)
            .catch((error) => {
                return error.response;
            });

        if (response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data.detail)
        } else {
            return response.data;
        }

    }
);

export const fetchParentTypeData = createAsyncThunk(
    "merchantReferralOnboardSlice/bank/fetchParentTypeData",
    async (requestParam, thunkAPI) => {
        const response = await fetchPerentTypeMerchantData(requestParam)
            .catch((error) => {
                return error.response;
            });

        if (response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data.detail)
        } else {
            return response.data;
        }

    }
);




export const updateBasicDetailsSlice = createAsyncThunk(
    "merchantReferralOnboardSlice/bank/updateBasicDetailsSlice",
    async (requestParam, thunkAPI) => {
        const response = await updateBasicDetails(requestParam)
            .catch((error) => {
                return error.response;
            });

        if (response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data.detail)
        } else {
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

export const getAllZoneName = createAsyncThunk(
    "merchantReferralOnboardSlice/bank/getAllZoneName",
    async (requestParam) => {
        const response = await getAllZoneCode(requestParam)
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

export const fetchChiledDataList = createAsyncThunk(
    "merchantReferralOnboardSlice/bank/fetchChiledDataList",
    async (data) => {

       
        const login_id = data?.login_id
        const refrerType = data?.type
        let param = ""

        if (data?.page) {
            param += `&page_size=${data?.page_size}`
        }
        if (data?.page_size) {
            param += `&page=${data?.page}`
        }
        if (refrerType === "bank") {
            param += `&bank_login_id=${login_id}`
        }
        if (refrerType === "referrer") {
            param += `&referrer_login_id=${login_id}`
        }

        const response = await axiosInstanceJWT
            .get(
                `${API_URL.fetchReferralChild}?type=${refrerType}${param}`)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);


export const resetFormState = createAsyncThunk(
    "merchantReferralOnboardSlice/bank/resetFormState",
    async () => {
        return true;
    }
)




export const merchantReferralOnboardSlice = createSlice({
    name: "merchantReferralOnboardSlice",
    initialState,
    reducers: {
        resetStateMfo: (state) => {
            // console.log("dispatch cleaer function")
            state.merchantBasicDetails.resp = {};
            state.bankDetails.resp = {};
            state.businessDetails.resp = {};
            state.documentCenter.resp = {};
            state.merchantOnboardingProcess.isOnboardStart = false
            state.merchantOnboardingProcess.isOnboardComplete = false
            state.merchantOnboardingProcess.merchantLoginId = ""
            localStorage.removeItem("onboardingStatusByAdmin")
        },
        clearErrorMerchantReferralOnboardSlice: (state) => {
            state.merchantBasicDetails.resp.error = false
            state.bankDetails.resp.error = false
            state.businessDetails.resp.error = false
        },
        updateOnboardingStatus: (state, action) => {
            // console.log("action.payload", action.payload)
            state.merchantOnboardingProcess.isOnboardComplete = true
            state.merchantOnboardingProcess.isOnboardStart = action.payload?.isOnboardStart
            state.merchantOnboardingProcess.merchantLoginId = action.payload?.merchantLoginId
            // const sessionDataC = JSON.parse(localStorage.getItem("onboardingStatusByAdmin"))
            const onboardingStatusComplete = {
                merchantLoginId: action.payload?.merchantLoginId,
                isOnboardStart: action.payload?.isOnboardStart,
                isOnboardComplete: true
            }
            // console.log("onboardingStatusComplete", onboardingStatusComplete)
            localStorage.setItem("onboardingStatusByAdmin", JSON.stringify(onboardingStatusComplete))
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
                        merchantLoginId: action.payload.merchant_data?.loginMasterId,
                        isOnboardStart: true
                    }
                    localStorage.setItem("onboardingStatusByAdmin", JSON.stringify(onboardingStatusByAdmin))
                }
            })
            .addCase(saveMerchantBasicDetails.rejected, (state, action) => {
                // console.log("action",action)
                state.merchantBasicDetails.resp.error = true
                state.merchantBasicDetails.resp.errorMsg = action.payload
            })

            .addCase(updateBasicDetailsSlice.pending, (state) => {
                // state.loading = 'loading';
            })
            .addCase(updateBasicDetailsSlice.fulfilled, (state, action) => {
                state.merchantBasicDetails.resp = action.payload.merchant_data
                if (action.payload.merchant_data?.status === "Activate") {
                    state.merchantOnboardingProcess.merchantLoginId = action.payload.merchant_data?.loginMasterId
                    state.merchantOnboardingProcess.isOnboardStart = true
                    const onboardingStatusByAdmin = {
                        merchantLoginId: action.payload.merchant_data?.loginMasterId,
                        isOnboardStart: true
                    }
                    localStorage.setItem("onboardingStatusByAdmin", JSON.stringify(onboardingStatusByAdmin))
                }
            })
            .addCase(updateBasicDetailsSlice.rejected, (state, action) => {
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

            ////////////////////////////////////////////////////////// for All zone
            .addCase(getAllZoneName.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(getAllZoneName.fulfilled, (state, action) => {
                state.getAllZoneCode.zoneCode = action.payload;
            })
            .addCase(getAllZoneName.rejected, (state, action) => {
                state.loading = 'failed';
            })
            ////////////////////////////////////////////////////

            .addCase(businessDetailsSlice.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(businessDetailsSlice.fulfilled, (state, action) => {
                state.businessDetails.resp = action.payload;
            })
            .addCase(businessDetailsSlice.rejected, (state, action) => {
                state.loading = 'failed';
            })

            .addCase(fetchChiledDataList.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchChiledDataList.fulfilled, (state, action) => {
                state.refrerChiledList.resp = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchChiledDataList.rejected, (state, action) => {
                state.loading = 'failed';
                state.isLoading = false;
            })
            .addCase(resetFormState.fulfilled, (state, action) => {
                state.merchantBasicDetails.resp = {};
                state.bankDetails.resp = {};
                state.businessDetails.resp = {};
                state.documentCenter.resp = {};
                state.merchantOnboardingProcess.isOnboardStart = false
                state.merchantOnboardingProcess.isOnboardComplete = false
                state.merchantOnboardingProcess.merchantLoginId = ""
            })



    }
})

export const { clearErrorMerchantReferralOnboardSlice, resetStateMfo, updateOnboardingStatus } = merchantReferralOnboardSlice.actions
export default merchantReferralOnboardSlice.reducer