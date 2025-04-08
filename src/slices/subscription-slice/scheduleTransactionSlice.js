import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { scheduleTransactionApi, userWiseTransactionSchedule } from "../../services/subscription-service/scheduleTransaction-service/scheduleTransaction.service";

import { getErrorMessage } from "../../utilities/errorUtils";
const initialState = {};

export const scheduleTransactionData = createAsyncThunk(
    "scheduleTransaction/scheduleTransactionData",
    async (requestParam, thunkAPI) => {
        try {
            const data = await scheduleTransactionApi(requestParam);
            return data;
        } catch (error) {
            const message = getErrorMessage(error)

            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const mandateTransactionSchedule = createAsyncThunk(
    "scheduleTransaction/mandateTransactionSchedule",
    async (requestParam, thunkAPI) => {
        try {
            const data = await userWiseTransactionSchedule(requestParam);
            return data;
        } catch (error) {
            const message = getErrorMessage(error)
            return thunkAPI.rejectWithValue(message);
        }
    }
);



const scheduleTransactionSlice = createSlice({
    name: "scheduleTransaction",
    initialState,
    extraReducers: (builder) => { },
});

export const scheduleTransactionSliceReducer = scheduleTransactionSlice.reducer;
