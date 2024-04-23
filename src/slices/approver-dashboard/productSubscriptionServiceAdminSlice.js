import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import API_URL from "../../config";


export const fetchMerchantProductSubscribeList = createAsyncThunk(
    "subscriptionProduct/merchantProductSubscribeList",
    async (data) => {
        const page = data?.page;
        const page_size = data?.page_size;
        const createdBy = data?.created_by
        const shouldIncludeCreatedBy = data.roleBased;
        const searchText = data.search
        const response = await axiosInstanceJWT
            .get(`${API_URL.fetchAllMerchantListWithSubscriptionData}&page=${page}&page_size=${page_size}${shouldIncludeCreatedBy ? `&created_by=${createdBy}` : ''}${searchText ? `&search=${searchText}` : ''}`)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

const initialState = {
    merchantProductSubscribeList: [],
    isLoading: false
}

export const productSubscriptionServiceAdminSlice = createSlice({
    name: "productSubscriptionServiceAdminSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder
        .addCase(fetchMerchantProductSubscribeList.pending, (state) => {
            state. isLoading=true

           
        })
            .addCase(fetchMerchantProductSubscribeList.fulfilled, (state, action) => {
                // state.loading = 'loading';
                state.merchantProductSubscribeList = action.payload;
                state. isLoading=false
            })

           .addCase(fetchMerchantProductSubscribeList.rejected, (state) => {
                state. isLoading=false
    
            })

    }
}
)


export default productSubscriptionServiceAdminSlice.reducer