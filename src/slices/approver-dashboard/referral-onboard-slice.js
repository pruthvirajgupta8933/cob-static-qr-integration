import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addReferralService } from "../../services/approver-dashboard/merchantReferralOnboard.service";
import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import API_URL from "../../config";

const initialState = {
  basicDetailsResponse: localStorage.getItem("onboardingStatusByReferrer")
    ? { data: JSON.parse(localStorage.getItem("onboardingStatusByReferrer")) }
    : {},
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
    updateBasicDetails: (state) => {
      // console.log("hi");
      state.basicDetailsResponse = {
        data: {
          ...state.basicDetailsResponse.data,
          clientCodeCreated: true,
        },
      };
      let onboardingStatusByReferrer = JSON.parse(
        localStorage.getItem("onboardingStatusByReferrer")
      );
      onboardingStatusByReferrer.clientCodeCreated = true;
      localStorage.setItem(
        "onboardingStatusByReferrer",
        JSON.stringify(onboardingStatusByReferrer)
      );
      // console.log("herer");
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
          name: action.payload.data?.name,
          loginMasterId: action.payload.data?.loginMasterId,
          business_cat_code: action.payload?.data?.business_cat_code,
          status: action.payload?.data?.status,
          isOnboardStart: true,
        };
        localStorage.setItem(
          "onboardingStatusByReferrer",
          JSON.stringify(onboardingStatusByReferrer)
        );
      })
      .addCase(saveBasicDetails.rejected, (state, action) => {
        state.basicDetailsResponse = {
          error: true,
          message: action.payload.message,
        };
      });
  },
});

export default referralOnboardSlice.reducer;
// {
//     "loginMasterId": 11489,
//     "name": "Test",
//     "email": "bac11106@rinseart.com",
//     "mobileNumber": "3245782751",
//     "password": "pbkdf2_sha256$320000$3c7KmB0Tu0ru0fWnz6xWNf$1m9RSiLNBEiF+RYb0TG1AEPsko7M+L+XwVMnyG4tycU=",
//     "username": "bac11106@rinseart.com",
//     "createdDate": "2024-10-08T11:49:27.431877",
//     "modifiedDate": null,
//     "modifiedBy": null,
//     "status": "Pending",
//     "reason": null,
//     "last_login": null,
//     "requestId": null,
//     "requestedClientType": null,
//     "requestedParentClientId": null,
//     "isDirect": false,
//     "is_social": false,
//     "business_cat_code": "13",
//     "onboard_type": "Referrer (Individual)",
//     "parent_bank_login_id": null,
//     "account_details_client_account_id": null,
//     "master_client_id": null,
//     "roleId": 13,
//     "created_by": 10829
// }
