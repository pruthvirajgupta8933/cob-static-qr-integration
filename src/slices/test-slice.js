import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import UseAxiosPrivate from "../customHooks/useAxiosPrivate";

const initialState = {
  books: [],
};

export const fetchTestSlice = createAsyncThunk(
  "profile/createClientProfile",
  async () => {
    try {
      const axiosPrivate = UseAxiosPrivate();
      const testUrl = "http://localhost:2020/v1/books";
      const response = await axiosPrivate.get(testUrl);
      console.log(response, "kk");
      //   thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      console.log(error, "error");
    }
  }
);

export const testSlice = createSlice({
  name: "test",
  initialState,
  extraReducers: {
    [fetchTestSlice.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchTestSlice.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.books = action.payload;
    },
    [fetchTestSlice.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {} = testSlice.actions;
export const testReducer = testSlice.reducer;
