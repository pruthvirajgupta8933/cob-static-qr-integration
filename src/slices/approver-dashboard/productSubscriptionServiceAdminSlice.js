import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {fetchSubscribedMerchantList} from "../../services/approver-dashboard/productSubscriptionServiceAdmin";
import {axiosInstanceJWT} from "../../utilities/axiosInstance";
import API_URL from "../../config";
import {merchantReferralOnboardSlice, saveMerchantBasicDetails} from "./merchantReferralOnboardSlice";


export const fetchMerchantProductSubscribeList = createAsyncThunk(
    "subscriptionProduct/merchantProductSubscribeList",
    async (data) => {
        const page =data?.page;
        const page_size =data?.page_size;
        const response = await axiosInstanceJWT
            .get(`${API_URL.fetchAllMerchantListWithSubscriptionData}&page=${page}&page_size=${page_size}`)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

const initialState = {
    merchantProductSubscribeList: []
}

export const productSubscriptionServiceAdminSlice = createSlice({
        name: "productSubscriptionServiceAdminSlice",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(fetchMerchantProductSubscribeList.fulfilled, (state, action) => {
                    // state.loading = 'loading';
                    state.merchantProductSubscribeList = action.payload;
                })
        }
    }
)


export default productSubscriptionServiceAdminSlice.reducer