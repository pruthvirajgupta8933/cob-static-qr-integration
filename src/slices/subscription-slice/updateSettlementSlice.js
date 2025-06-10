import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { settlementHistoryApi } from "../../services/subscription-service/update-settlement-service/updateSettlement.service";
import { getErrorMessage } from "../../utilities/errorUtils";




const initialState = {}





export const settlementHistory = createAsyncThunk(
    "e-nach settlement/settlementHistory",
    async (object, thunkAPI) => {
        try {
            const data = await settlementHistoryApi(object);
            return data
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data);

            return thunkAPI.rejectWithValue(message);
        }
    }
);





const updateSettlementApiSlice = createSlice({
    name: "e-nach-settlement",
    initialState,
    extraReducers: (builder) => {

    },
});


export const updateSettlementApiSliceReducer = updateSettlementApiSlice.reducer;
