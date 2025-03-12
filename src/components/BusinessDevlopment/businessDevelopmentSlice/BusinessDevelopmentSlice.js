import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import merchantAssignedService from "../businessDevelopmentService/businessDevelopment.service";
import { setMessage } from "../../../slices/message";
import { getErrorMessage } from "../../../utilities/errorUtils";




const initialState = {
    assignedMerchantList: {
        results: [],
        count: 0,
    },
    isLoading: false,

};

export const getAssignedMerchantData = createAsyncThunk(
    "merchantAssigned/getAssignedMerchantData",
    async (requestParams, thunkAPI) => {
        try {
            const response = await merchantAssignedService.getAssignedMerchant(requestParams);


            // thunkAPI.dispatch(setMessage(response.data.message));
            return response.data;
        } catch (error) {
            const message = getErrorMessage(error);

            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message); // Return the message here
        }
    }
);








export const merchantAssignedSlice = createSlice({
    name: "merchantAssigned",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(getAssignedMerchantData.pending, (state) => {
                state.status = "pending";
                state.isLoading = true;

            })
            .addCase(getAssignedMerchantData.fulfilled, (state, action) => {
                state.assignedMerchantList = action.payload;
                state.isLoading = false;
            })
            .addCase(getAssignedMerchantData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                state.isLoading = false;
            })
    },
});
export const {

} = merchantAssignedSlice.actions;
export const merchantAssignedReducer = merchantAssignedSlice.reducer;
