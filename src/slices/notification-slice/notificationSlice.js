import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { readNotification } from "../../services/notification-service/notification.service";
import { setMessage } from "../message";


const initialState = {
    notification: {
        loading: false,
        error:false,
        data: []
    }
}

export const fetchReadNotification = createAsyncThunk(
    "notification/fetchReadNotification",
    async (object, thunkAPI) => {
        try {
            const data = await readNotification(object);
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




const notificationSlice = createSlice({
    name: "notificationSlice",
    initialState,
    extraReducers: {
        [fetchReadNotification.pending]: (state) => {
            state.notification.loading = true
            state.notification.data = []
        },
        [fetchReadNotification.fulfilled]: (state, action) => {
            console.log(action)
            state.notification.loading = false
            state.notification.data = []
        },
        [fetchReadNotification.rejected]: (state) => {
            state.notification.loading = false
            state.notification.error = true
            state.notification.data = [];
        },

    },
});


export default notificationSlice.reducer;
