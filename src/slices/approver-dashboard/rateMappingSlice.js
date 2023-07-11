import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const InitialState = {
    flag: false,
    merhcantLoginId: null,
    errorMsg: [],
    error: false
}




const rateMappingSlice = createSlice({
    name: "rateMappingSlice",
    initialState: InitialState,
    reducers: {
        ratemapping: (state, action) => {
            state.merhcantLoginId = action.payload?.merchantLoginId
            if (action.payload?.merchantLoginId !== "" && action.payload?.merchantLoginId !== undefined && action.payload?.merchantLoginId !== null) {
                state.flag = true
            }
        },
        clearRatemapping: (state) => {
            state.flag = false
            state.merhcantLoginId = null
            state.errorMsg = []
            state.error = false

        }

    },

});



export const { ratemapping, clearRatemapping } = rateMappingSlice.actions

const { reducer } = rateMappingSlice;
export default reducer;