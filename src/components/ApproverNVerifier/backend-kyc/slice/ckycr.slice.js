import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ckycrServices } from "../service/ckycr.service";
// import { setMessage } from "../message";


const initialState = {
    data: [],
    loading: false
}


export const saveCkycr = createAsyncThunk(
    "ckycr/saveCkycr",
    async (dataObj, thunkAPI) => {
        try {
            const response = await ckycrServices.ckycrSave(dataObj);
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            // thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const fetchCkycr = createAsyncThunk(
    "ckycr/fetchCkycr",
    async (dataObj, thunkAPI) => {
        try {
            const response = await ckycrServices.ckycrFetch(dataObj);
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            // thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    }
);


const ckycrSlice = createSlice({
    name: "ckycr",
    initialState: initialState,
    extraReducers: {
        [fetchCkycr.pending]: (state, action) => {
            state.loading = true
            state.data = [];
        },
        [fetchCkycr.fulfilled]: (state, action) => {
            state.loading = false
            state.data = action.payload;
        },
        [fetchCkycr.rejected]: (state, action) => {
            state.loading = false

        },
    }

});

// const { reducer } = ckycrSlice;
export const ckycrReducer = ckycrSlice.reducer;