import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import menulistService from "../../services/cob-dashboard/menulist.service";
import { setMessage } from "../message";


const listOfMenus = {
    enableMenu:[],
    isLoading:false
}


export const fetchMenuList = createAsyncThunk(
    "menulist/fetchMenuList",
    async (dataObj, thunkAPI) => {
      try {
        const response = await menulistService.menulist(dataObj);
        thunkAPI.dispatch(setMessage(response.data.message));
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


  const menulistSlice = createSlice({
    name: "menulist",
    initialState: listOfMenus,
    extraReducers:{
        [fetchMenuList.pending]: (state, action) => {
            state.isLoading = false
            state.enableMenu = [];
          },
          [fetchMenuList.fulfilled]: (state, action) => {
            state.isLoading = true
            state.enableMenu =  action.payload;
          },
          [fetchMenuList.rejected]: (state, action) => {
            state.isLoading = false
            state.enableMenu = [];
          },
    }

});

const { reducer } = menulistSlice;
export default reducer;