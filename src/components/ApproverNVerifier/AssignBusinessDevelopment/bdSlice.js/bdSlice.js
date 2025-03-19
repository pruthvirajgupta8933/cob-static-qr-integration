import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { setMessage } from "../../../../slices/message";

import { assignBdApi } from "../BdService/bdDevelopment.service";

const initialState = {





};




export const assignBd = createAsyncThunk(
    "assign-bd/assignBd",
    async (requestParam, thunkAPI) => {

        try {
            const response = await assignBdApi(requestParam);
            // thunkAPI.dispatch(setMessage(response.data.message));
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString() || error.request.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);


        }
    }
);




export const assignBdSlice = createSlice({
    name: "assign-bd",
    initialState,
    reducers: {},

    extraReducers: (builder) => { }
});

export const assignBdReducer = assignBdSlice.reducer;
