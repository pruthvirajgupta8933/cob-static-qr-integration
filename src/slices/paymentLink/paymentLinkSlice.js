import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import paymentLinkService from "../../services/create-payment-link/paymentLink.service";
const initialState = {
    getPayerDetails: {
        result: [],
        count: 0
    }
};

export const getPayerApi = createAsyncThunk(
    "getPayerApi",
    async (requestParam, thunkAPI) => {
        try {
            const response = await paymentLinkService.getPayer(requestParam);
            return response.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.detail) ||
                error.message ||
                error.toString() ||
                error.request.toString();
            // thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    }



);


export const getPayMentLink = createAsyncThunk(
    "getPayMentLink",
    async (requestParam, thunkAPI) => {
        try {
            const response = await paymentLinkService.getPaymentLink(requestParam);
            return response.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.detail) ||
                error.message ||
                error.toString() ||
                error.request.toString();
            // thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    }



);


export const paymentLinkSlice = createSlice({
    name: "paymentLinkSlice",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(getPayerApi.pending, (state) => {
                // state.infoBulletin = { loading: true };
            })
            .addCase(getPayerApi.fulfilled, (state, action) => {
                state.getPayerDetails = action.payload
            })
            .addCase(getPayerApi.rejected, (state) => {
                // state.infoBulletin = { error: true };
            });
    },
});

export const paymentLinkSliceReducer = paymentLinkSlice.reducer;
