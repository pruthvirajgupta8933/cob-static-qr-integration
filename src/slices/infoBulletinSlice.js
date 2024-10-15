import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getInfoBulletin } from "../services/infoBulletin.service";
const initialState = {
  infoBulletin: {},
};

export const infoBulletin = createAsyncThunk(
  "information-bulletin",
  async (requestParam, thunkAPI) => {
    try {
      const response = await getInfoBulletin();
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.detail) ||
        error.message ||
        error.toString() ||
        error.request.toString();
      // thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const infoBulletinSlice = createSlice({
  name: "infoBulletinSlice",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(infoBulletin.pending, (state) => {
        state.infoBulletin = { loading: true };
      })
      .addCase(infoBulletin.fulfilled, (state, action) => {
        state.infoBulletin = { data: action.payload };
      })
      .addCase(infoBulletin.rejected, (state) => {
        state.infoBulletin = { error: true };
      });
  },
});

export const infoBulletinReducer = infoBulletinSlice.reducer;
