import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import { Payoutservice } from "../services/payoutService";
import API_URL from "../config";
import {axiosInstanceJWT} from "../utilities/axiosInstance";

const initialState = {
  ledgerDetails: [],
  ledgerMerchant: [],
  beneficiaryList: [],
  transactionsMode: [],
  paymentRequest: [],
  isLoading: false,
  clientData: [],
};
export const fetchClientCode = createAsyncThunk(
  "dashbaord/payout/ledger",
  async (thunkAPI) => {
    try {
      const response = await Payoutservice.fetchClientCode();
      sessionStorage.setItem("ap", JSON.stringify(response?.data?.data?.auth_token));
      sessionStorage.setItem("mid", JSON.stringify(response?.data?.data?.id));
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

export const fetchledgerMerchantData = createAsyncThunk(
  "dashbaord/ledger",
  async (data, thunkAPI) => {
    try {
      const response = await Payoutservice.ledgersMerchant(data);
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

export const fetchPayoutLedgerReportSlice = createAsyncThunk(
  "dashbaord/fetchPayoutLedgerReport",
  async (data) => {
    const authToken = JSON.parse(sessionStorage.getItem("ap"));
    const response = await axiosInstanceJWT
      .post(
        `${API_URL.getLedgersMerchantList}/?page=${data.data.pageNumber}&page_size=${data.data.pageSize}`,
        data.param,
        {
          headers: {
            "auth-token": authToken,
          },
        }
      )
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const fetchBeneficiaryDetails = createAsyncThunk(
  "dashbaord/beneficiary",
  async (data) => {
    const authToken = JSON.parse(sessionStorage.getItem("ap"));
    const merchantID = JSON.parse(sessionStorage.getItem("mid"));
    const response = await axiosInstanceJWT
      .get(
        `${API_URL.fetchBeneficiary}/${merchantID}?page=${data.data.pageNumber}&page_size=${data.data.pageSize}`,
        {
          headers: {
            "auth-token": authToken,
          },
        }
      )
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);
export const fetchTransactionModes = createAsyncThunk(
  "dashbaord/payment_status",
  async (data) => {
    const authToken = JSON.parse(sessionStorage.getItem("ap"));
    const param = {
      query: {
        merchant_id: authToken,
      },
    };

    const response = await axiosInstanceJWT
      .post(`${API_URL.transactionMode}/`, param, {
        headers: {
          "auth-token": authToken,
        },
      })
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);
export const PaymentRequest = createAsyncThunk(
  "dashbaord/payment_status",
  async (data) => {
    const authToken = JSON.parse(sessionStorage.getItem("ap"));
    const response = await axiosInstanceJWT
      .post(`${API_URL.paymentRequest}/`, data, {
        headers: {
          "auth-token": authToken,
        },
      })
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);
export const payoutSlice = createSlice({
  name: "payout",
  initialState,
  reducers: {
    clearTransactionHistory: (state) => {
      state.ledgerDetails = [];
    },
    clearSuccessTxnsummary: (state) => {
      state.ledgerDetails = [];
    },
    clearSettlementReport: (state) => {
      state.ledgerDetails = [];
    },
  },
  extraReducers: {
    [fetchClientCode.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchClientCode.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.clientData = action.payload;
    },
    [fetchClientCode.rejected]: (state) => {
      state.isLoading = false;
    },
    [fetchledgerMerchantData.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchledgerMerchantData.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.ledgerMerchant = action.payload;
    },
    [fetchledgerMerchantData.rejected]: (state) => {
      state.isLoading = false;
    },
    [fetchPayoutLedgerReportSlice.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchPayoutLedgerReportSlice.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.ledgerDetails = action.payload;
    },
    [fetchPayoutLedgerReportSlice.rejected]: (state) => {
      state.isLoading = false;
    },
    [fetchBeneficiaryDetails.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchBeneficiaryDetails.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.beneficiaryList = action.payload;
    },
    [fetchBeneficiaryDetails.rejected]: (state) => {
      state.isLoading = false;
    },
    [fetchTransactionModes.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchTransactionModes.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.transactionsMode = action.payload;
    },
    [fetchTransactionModes.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  clearTransactionHistory,
  clearSuccessTxnsummary,
  clearSettlementReport,
} = payoutSlice.actions;
export const payoutReducer = payoutSlice.reducer;
