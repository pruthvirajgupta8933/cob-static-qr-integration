import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mandateByApi, bulkCreateEmandateApi } from "../../services/subscription-service/createEmandateByApi.service";




const initialState = {}





export const createEmandateByApi = createAsyncThunk(
    "createEmandateByApi/createEmandateByApi",
    async (object, thunkAPI) => {
        try {
            const data = await mandateByApi(object);
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


export const bulkCreateEmandate = createAsyncThunk(
    "bulkCreateEmandateApi/bulkCreateEmandateApi",
    async (object, thunkAPI) => {
        try {
            const data = await bulkCreateEmandateApi(object);
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


const creatEmandateByApiSlice = createSlice({
    name: "createMandateByApi",
    initialState,
    extraReducers: (builder) => {

    },
});


export const createEmandateByApiSliceReducer = creatEmandateByApiSlice.reducer;
