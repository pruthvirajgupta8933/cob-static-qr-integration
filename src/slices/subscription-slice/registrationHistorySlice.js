import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getAllMandateApi, transactionHistoryByuserApi } from "../../services/subscription-service/registrationHistory-service/registrationHistory.service";


const initialState = {}

export const registrationHistoryData = createAsyncThunk(
    "registrationHistoryData/registrationHistoryData",
    async (requestParam, thunkAPI) => {

        try {
            const data = await getAllMandateApi(requestParam);
            return data
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.detail) ||
                error.message ||
                error.toString() || error.request.toString();
            // thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const transactionHistoryByUser = createAsyncThunk(
    "transactionHistoryByUser/transactionHistoryByUser",
    async (object, thunkAPI) => {
        try {
            const data = await transactionHistoryByuserApi(object);
            return data
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString() || error.request.toString();

            return thunkAPI.rejectWithValue(message);
        }
    }
);







const registrationHisorySlice = createSlice({
    name: "registrationHistorySlice",
    initialState,
    extraReducers: (builder) => {

    },
});


export const registrationHisorySliceReducer = registrationHisorySlice.reducer;
