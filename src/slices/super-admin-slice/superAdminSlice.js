import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "../message";
import { adminTableList, superAdminGetFilters, superAdminFetchData } from "../../services/super-admin-service/superAdmin.service";


export const tableList = createAsyncThunk(
    "superAdminSlice/productDetails",
    async (requestParam, thunkAPI) => {

        try {
            const response = await adminTableList();

            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }
    }
);


export const superAdminFilters = createAsyncThunk(
    "superAdminSlice/superAdminFilters",
    async (requestParam, thunkAPI) => {

        try {
            const response = await superAdminGetFilters(requestParam);

            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }
    }
);


export const superAdminReports = createAsyncThunk(
    "superAdminSlice/superAdminReports",

    async ({ body, query }, thunkAPI) => {
        try {

            const response = await superAdminFetchData(body, query);
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }
    }
);



export const superAdminSlice = createSlice({
    name: "superAdminSlice",
    initialState: {
        tableListData: {},
    },

    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(tableList.fulfilled, (state, action) => {
                state.tableListData = action.payload;
            })
    },
});

export const superAdminSliceReducer = superAdminSlice.reducer;
