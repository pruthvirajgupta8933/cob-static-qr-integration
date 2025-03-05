import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { setMessage } from "../../../slices/message";
import { updateMfa } from "./mfa.service";

const initialState = {





};




export const updateMfaStatus = createAsyncThunk(
    "mfa/updateMfaStatus",
    async (requestParam, thunkAPI) => {

        try {
            const response = await updateMfa(requestParam);
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




export const mfaSlice = createSlice({
    name: "mfa",
    initialState,
    reducers: {},

    extraReducers: (builder) => { }
});
export const { } = mfaSlice.actions;
export const mfaReducer = mfaSlice.reducer;
