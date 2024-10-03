import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addReferralService } from "../../services/approver-dashboard/merchantReferralOnboard.service";
import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import API_URL from "../../config";

const initialState = {
  basicDetailsResponse:
    JSON.parse(localStorage.getItem("onboardingStatusByReferrer")) || {},
};

export const saveBasicDetails = createAsyncThunk(
  "referralOnboardSlice/saveBasicDetails",
  async (requestParam, thunkAPI) => {
    const response = await addReferralService(requestParam).catch((error) => {
      return error.response;
    });

    if (response.status !== 200) {
      return thunkAPI.rejectWithValue(response.data.detail);
    } else {
      return response.data;
    }
  }
);

export const saveAddressDetails = createAsyncThunk(
  "referralOnboardSlice/saveAddressDetails",
  async (requestParam) => {
    const response = await axiosInstanceJWT
      .post(API_URL.saveReferralAddress, requestParam)
      .catch((error) => {
        return error.response;
      });

    if (response.status !== 200) {
      throw new Error(response.data.detail);
    } else {
      return response.data;
    }
  }
);

export const saveReferralIds = createAsyncThunk(
  "referralOnboardSlice/saveReferralIds",
  async (requestParam) => {
    const response = await axiosInstanceJWT
      .post(API_URL.saveReferralIds, requestParam)
      .catch((error) => {
        return error.response;
      });

    if (response.status !== 200) {
      throw new Error(response.data.detail);
    } else {
      return response.data;
    }
  }
);

export const saveBusinessOverview = createAsyncThunk(
  "referralOnboardSlice/saveBusinessOverview",
  async (requestParam) => {
    const response = await axiosInstanceJWT
      .post(API_URL.saveReferralBizOverview, requestParam)
      .catch((error) => {
        return error.response;
      });
    console.log(response);

    if (response.status !== 200) {
      throw new Error(response.data.detail);
    } else {
      return response.data;
    }
  }
);

export const referralOnboardSlice = createSlice({
  name: "referralOnboardSlice",
  initialState,
  reducers: {
    resetBasicDetails: (state) => {
      state.basicDetailsResponse = {};
      localStorage.removeItem("onboardingStatusByReferrer");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveBasicDetails.pending, (state) => {
        state.basicDetailsResponse = { loading: true };
      })
      .addCase(saveBasicDetails.fulfilled, (state, action) => {
        state.basicDetailsResponse = { data: action.payload.data };
        const onboardingStatusByReferrer = {
          masterLoginId: action.payload.data?.loginMasterId,
          businessType: action.payload?.data?.business_cat_code,
          isOnboardStart: true,
        };
        localStorage.setItem(
          "onboardingStatusByReferrer",
          JSON.stringify(onboardingStatusByReferrer)
        );
      })
      .addCase(saveBasicDetails.rejected, (state) => {
        state.basicDetailsResponse = { error: true };
      });
  },
});

export default referralOnboardSlice.reducer;
