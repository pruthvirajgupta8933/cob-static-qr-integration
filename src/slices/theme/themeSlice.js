import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dashboardHeader: {
        headerMenuToggle: false
    }
}

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        dashboardHeaderMenuToggle: (state, action) => {
            let data = action.payload
            state.dashboardHeader.headerMenuToggle = !data
        }
    },
    extraReducers: {}
});
export const { dashboardHeaderMenuToggle } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;








