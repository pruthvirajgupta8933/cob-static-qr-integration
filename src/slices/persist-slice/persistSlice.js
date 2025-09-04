import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import API_URL from "../../config";
import { setMessage } from "../message";
import { productDetailsUrl } from "../../services/merchant-service/prouduct-catalogue.service";
import { Dashboardservice } from "../../services/dashboard.service";

export const fetchRollingReservePeriod = createAsyncThunk(
    "commonPersistSlice/fetchRollingReservePeriod",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstanceJWT.get(API_URL.rollingReservePeriod);
            return response.data;
        } catch (error) {
            return rejectWithValue("Rolling reserve period not found. Please try again later.");
        }
    }
);

export const fetchParentClientCodes = createAsyncThunk(
    "commonPersistSlice/fetchParentClientCodes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstanceJWT.get(API_URL.fetchParentClientCodes);
            return response.data;
        } catch (error) {
            return rejectWithValue("Parent client codes could not be fetched.");
        }
    }
);


export const productDetails = createAsyncThunk(
    "commonPersistSlice/productDetails",
    async (requestParam, thunkAPI) => {

        try {
            const response = await productDetailsUrl(requestParam);

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


export const fetchPayStatusList = createAsyncThunk(
    "commonPersistSlice/paystatus",
    async (data, thunkAPI) => {
        try {
            const response = await Dashboardservice.getPayStatusList();
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


export const fetchPayModeList = createAsyncThunk(
    "commonPersistSlice/paymode",
    async (data, thunkAPI) => {
        try {
            const response = await Dashboardservice.getPayModeList();
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


export const fetchChildDataList = createAsyncThunk(
    "commonPersistSlice/fetchChildDataList",
    async (data) => {
        const login_id = data?.login_id;
        const refrerType = data?.type;
        let param = "";

        if (data?.page) {
            param += `&page_size=${data?.page_size}`;
        }
        if (data?.page_size) {
            param += `&page=${data?.page}`;
        }
        if (refrerType === "bank") {
            param += `&bank_login_id=${login_id}`;
        }
        if (refrerType === "referrer") {
            param += `&referrer_login_id=${login_id}`;
        }

        const response = await axiosInstanceJWT
            .get(`${API_URL.fetchReferralChild}?type=${refrerType}${param}`)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

export const commonPersistSlice = createSlice({
    name: "commonPersistSlice",
    initialState: {
        rollingReservePeriod: {
            rollingResPeriod: null,
            loading: false,
            error: null,
        },
        parentClientCodes: {
            data: null,
            loading: false,
            error: null,
        },
        productDetailsData: [],
        isLoading: false,
        errorState: false,

        refrerChiledList: {
            resp: {},
        },

        payStatus: localStorage.getItem("pay-status")
            ? JSON.parse(localStorage.getItem("pay-status"))
            : [],

        paymode: localStorage.getItem("pay-mode")
            ? JSON.parse(localStorage.getItem("pay-mode"))
            : [],
    },




    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRollingReservePeriod.pending, (state) => {
                state.rollingReservePeriod.loading = true;
                state.rollingReservePeriod.error = null;
            })
            .addCase(fetchRollingReservePeriod.fulfilled, (state, action) => {
                state.rollingReservePeriod.loading = false;
                state.rollingReservePeriod.rollingResPeriod = action.payload;
            })
            .addCase(fetchRollingReservePeriod.rejected, (state, action) => {
                state.rollingReservePeriod.loading = false;
                state.rollingReservePeriod.error = action.payload;
            })
            .addCase(fetchParentClientCodes.pending, (state) => {
                state.parentClientCodes.loading = true;
                state.parentClientCodes.error = null;
            })
            .addCase(fetchParentClientCodes.fulfilled, (state, action) => {

                state.parentClientCodes.loading = false;
                state.parentClientCodes.data = action.payload;
            })
            .addCase(fetchParentClientCodes.rejected, (state, action) => {
                state.parentClientCodes.loading = false;
                state.parentClientCodes.error = action.payload;
            })
            .addCase(productDetails.pending, (state) => {
                state.isLoading = true
            })
            .addCase(productDetails.fulfilled, (state, action) => {
                state.productDetailsData = action.payload.ProductDetail
                state.isLoading = false
            })
            .addCase(productDetails.rejected, (state, action) => {
                state.isLoading = false
            })

            .addCase(fetchPayStatusList.fulfilled, (state, action) => {
                state.payStatus = action.payload;
                localStorage.setItem("pay-status", JSON.stringify(action.payload));
            })
            .addCase(fetchPayModeList.fulfilled, (state, action) => {
                state.paymode = action.payload;
                localStorage.setItem("pay-mode", JSON.stringify(action.payload));
            })

            .addCase(fetchChildDataList.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchChildDataList.fulfilled, (state, action) => {
                state.refrerChiledList.resp = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchChildDataList.rejected, (state, action) => {
                // state.loading = "failed";
                state.isLoading = false;
            })
    },
});

export const commonPersistSliceReducer = commonPersistSlice.reducer;
