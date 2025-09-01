import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bankDashboardService } from "../../services/bank/bank.service";

const initialState = {
    merhcantDetailsList: [],
    merchantSummary: [],
    reportLoading: false
}


export const fetchBankMerchantDetailList = createAsyncThunk(
    "bankdashboard/merchantDetailsList",
    async (dataObj, thunkAPI) => {
        try {
            const response = await bankDashboardService.bankMerchantDetailList(dataObj);
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(message);
            return thunkAPI.rejectWithValue();
        }
    }
);


export const fetchBankMerchantSummary = createAsyncThunk(
    "bankdashboard/merchantSummary",
    async (dataObj, thunkAPI) => {
        try {
            const response = await bankDashboardService.bankMerchantSummary(dataObj);
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(message);
            return thunkAPI.rejectWithValue();
        }
    }
);


const bankDashboardSlice = createSlice({
    name: "bankDasbhaord",
    initialState: initialState,
    extraReducers: {
        [fetchBankMerchantDetailList.pending]: (state, action) => {
            state.merhcantDetailsList = [];
            state.reportLoading = true
        },
        [fetchBankMerchantDetailList.fulfilled]: (state, action) => {
            state.merhcantDetailsList = action.payload;
            state.reportLoading = false
        },
        [fetchBankMerchantDetailList.rejected]: (state, action) => {
            state.reportLoading = false
        },

        [fetchBankMerchantSummary.pending]: (state, action) => {
            state.merchantSummary = [];
            state.reportLoading = true
        },
        [fetchBankMerchantSummary.fulfilled]: (state, action) => {
            state.merchantSummary = action.payload;
            state.reportLoading = false
        },
        [fetchBankMerchantSummary.rejected]: (state, action) => {
            state.reportLoading = false
        }
    }

});


export const bankDashboardReducer = bankDashboardSlice.reducer