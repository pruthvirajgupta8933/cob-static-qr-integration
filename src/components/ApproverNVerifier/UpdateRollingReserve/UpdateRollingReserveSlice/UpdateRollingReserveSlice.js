import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../../../utilities/errorUtils";
import { setMessage } from "../../../../slices/message";
import updateRollingReserveService from '../UpdateRollingReserveService/UpdateRollingReserve.service'
const initialState = {
    postdata: {},

};

export const updateRollingReserveApi = createAsyncThunk(
    "updateRollingReserveApi/updateRollingReserveApi ",
    async (requestParam, thunkAPI) => {

        try {
            const response = await updateRollingReserveService.updateRollingReserve(requestParam);

            return response.data;
        } catch (error) {
            const message = getErrorMessage(error);

            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);


        }
    }
);


export const updateRollingReserveSlice = createSlice({
    name: "updateRollingReserve",
    initialState,
    reducers: {},
    extraReducers: {}
});

export const updateRollingReserveReducer = updateRollingReserveSlice.reducer;
