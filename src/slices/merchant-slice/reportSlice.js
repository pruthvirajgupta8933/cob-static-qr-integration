import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { branchTransactionReport, fetchSettledTransactionHistoryDsoitc, fetchTransactionHistoryDoitc } from "../../services/merchant-service/reports.service";
import { setMessage } from "../message";


const initialState = {
    transactionHistoryDoitc: {
        data: [],
        loading: false,
        message: ""
    },
    settledTransactionHistoryDoitc: {
        data: [],
        loading: false,
        message: ""
    },
    brnachTransactionSlice: {
        loading: false,
        data: []
    }
}



export const transactionHistoryDoitc = createAsyncThunk(
    "reports/transactionHistoryDoitc",
    async (object, thunkAPI) => {
        try {
            const data = await fetchTransactionHistoryDoitc(object);
            // console.log(data)
            return { data: data };
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


export const brnachTransactionSlice = createAsyncThunk(
    "reports/brnachTransactionSlice",
    async (object, thunkAPI) => {
        try {
            const data = await branchTransactionReport(object);
            // console.log(data?.data)
            return data?.data
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

export const settledTransactionHistoryDoitc = createAsyncThunk(
    "reports/settledTransactionHistoryDoitc",
    async (object, thunkAPI) => {
        try {
            const data = await fetchSettledTransactionHistoryDsoitc(object);
            return { data: data };
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




const merchantReportSlice = createSlice({
    name: "merchantReports",
    initialState,
    reducers: {
        clearTransactionHistoryDoitc: (state) => {
            state.transactionHistoryDoitc.loading = false;
            state.transactionHistoryDoitc.data = [];
        },
        clearSettledTransactionHistory: (state) => {
            state.settledTransactionHistoryDoitc.data = []
            state.settledTransactionHistoryDoitc.loading = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(transactionHistoryDoitc.pending, (state) => {
                state.transactionHistoryDoitc.loading = true;
                state.transactionHistoryDoitc.data = [];
            })
            .addCase(transactionHistoryDoitc.fulfilled, (state, action) => {
                state.transactionHistoryDoitc.loading = false;
                state.transactionHistoryDoitc.data = action.payload?.data?.data
            })

            .addCase(transactionHistoryDoitc.rejected, (state) => {
                state.transactionHistoryDoitc.loading = false;
                state.transactionHistoryDoitc.data = [];
            })
            .addCase(settledTransactionHistoryDoitc.pending, (state) => {
                state.settledTransactionHistoryDoitc.loading = true;
                state.settledTransactionHistoryDoitc.data = [];
            })
            .addCase(settledTransactionHistoryDoitc.fulfilled, (state, action) => {

                state.settledTransactionHistoryDoitc.loading = false;
                state.settledTransactionHistoryDoitc.data = action.payload?.data?.data;
            })
            .addCase(settledTransactionHistoryDoitc.rejected, (state) => {
                state.settledTransactionHistoryDoitc.loading = false;
                state.settledTransactionHistoryDoitc.data = [];
            })

            .addCase(brnachTransactionSlice.pending, (state) => {
                state.brnachTransactionSlice.loading = true;
                state.brnachTransactionSlice.data = [];
            })
            .addCase(brnachTransactionSlice.fulfilled, (state, action) => {

                state.brnachTransactionSlice.loading = false;
                state.brnachTransactionSlice.data = action.payload;
            })
            .addCase(brnachTransactionSlice.rejected, (state) => {
                state.brnachTransactionSlice.loading = false;
                state.brnachTransactionSlice.data = [];
            })
    },
});


export default merchantReportSlice.reducer;
export const {
    clearTransactionHistoryDoitc,
    clearSettledTransactionHistory
} = merchantReportSlice.actions
