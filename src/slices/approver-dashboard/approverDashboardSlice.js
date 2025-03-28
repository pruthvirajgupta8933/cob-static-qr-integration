import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import approverDashboardService from "../../services/approver-dashboard/approverDashboard.service.js";
import { setMessage } from "../message";

const InitialState = {
  businessCategoryType: [],
  generalFormData: {
    isFinalSubmit: false,
  },
  clientCodeList: localStorage?.getItem("all-client-code")
    ? JSON.parse(localStorage.getItem("all-client-code"))
    : [],
  clientCodeByRole: {},
  subMerchantList: {},
};

export const businessCategoryType = createAsyncThunk(
  "approverDashbaordSlice/businessCategoryType",
  async (object = {}, thunkAPI) => {
    try {
      const response = await approverDashboardService.businessCategoryType();

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

export const getAllCLientCodeSlice = createAsyncThunk(
  "approverDashbaordSlice/getAllCLientCodeSlice",
  async (object = {}, thunkAPI) => {
    try {
      const response = await approverDashboardService.getAllClientCode();

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

export const getCLientCodeByRoleSlice = createAsyncThunk(
  "approverDashbaordSlice/getCLientCodeByRoleSlice",
  async (object = {}, thunkAPI) => {
    try {
      const response = await approverDashboardService.getClientCodeByRole(
        object?.role
      );

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

export const createSubMerchant = createAsyncThunk(
  "merchantReferralOnboardSlice/subMerchant/save",
  async (requestParam) => {
    const response = await approverDashboardService
      .saveSubMerchant(requestParam)
      .catch((error) => {
        return error.response;
      });
    return response.data;
  }
);
export const fetchSubMerchant = createAsyncThunk(
  "merchantReferralOnboardSlice/subMerchant/edit",
  async (requestParam) => {
    const response = await approverDashboardService
      .getSubMerchants(requestParam)
      .catch((error) => {
        return error.response;
      });
    return response.data;
  }
);
const approverDashboardSlice = createSlice({
  name: "approverDashboard",
  initialState: InitialState,
  reducers: {
    generalFormData: (state, action) => {
      //  console.log(action.payload)
      state.generalFormData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(businessCategoryType.pending, (state) => {
        state.businessCategoryType = [];
      })

      .addCase(businessCategoryType.fulfilled, (state, action) => {
        state.businessCategoryType = action.payload.result;
      })
      .addCase(businessCategoryType.rejected, (state, action) => {
        state.businessCategoryType = [];
      })

      .addCase(getAllCLientCodeSlice.pending, (state) => {
        state.clientCodeList = [];
      })
      .addCase(getAllCLientCodeSlice.fulfilled, (state, action) => {
        state.clientCodeList = action.payload.result;
        if (action.payload.result?.length > 0)
          localStorage.setItem(
            "all-client-code",
            JSON.stringify(action.payload.result)
          );
      })
      .addCase(getAllCLientCodeSlice.rejected, (state, action) => {
        state.clientCodeList = [];
      })

      .addCase(getCLientCodeByRoleSlice.pending, (state, action) => {
        state.clientCodeByRole = { [action.meta.arg?.role]: [] };
      })
      .addCase(getCLientCodeByRoleSlice.fulfilled, (state, action) => {
        state.clientCodeByRole = {
          [action.meta.arg?.role]: action.payload.result,
        };
      })
      .addCase(getCLientCodeByRoleSlice.rejected, (state, action) => {
        state.clientCodeByRole = { [action.meta.arg?.role]: { error: true } };
      })
      .addCase(fetchSubMerchant.pending, (state, action) => {
        state.subMerchantList = { [action.meta.arg?.login_id]: [] };
      })
      .addCase(fetchSubMerchant.fulfilled, (state, action) => {
        state.subMerchantList = {
          [action.meta.arg?.login_id]: action.payload,
        };
      })
      .addCase(fetchSubMerchant.rejected, (state, action) => {
        state.subMerchantList = {
          [action.meta.arg?.login_id]: { error: true },
        };
      });
  },
});

export const { generalFormData } = approverDashboardSlice.actions;

const { reducer } = approverDashboardSlice;
export default reducer;
