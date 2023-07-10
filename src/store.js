import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import messageReducer from "./slices/message";
import { dashboardReducer } from "./slices/dashboardSlice";
import reducerSubscription from "./slices/subscription";
import { kycReducer } from "./slices/kycSlice";
import { merchantZoneMappingReducer } from "./slices/merchantZoneMappingSlice";
import { merchantListReducer } from "./slices/approverVerifierTabSlice";
import { kycOperationReducer } from "./slices/kycOperationSlice";
import { payoutReducer } from "./slices/payoutSlice";
import menuListReducer from "./slices/cob-dashboard/menulistSlice";
import productCatalogueSlice from "./slices/merchant-slice/productCatalogueSlice";
import { ReferralMidReducer } from "./slices/referralAndMidOperationSlice";
import { challanReducer } from "./slices/backTobusinessSlice";
import merchantReportSlice from "./slices/merchant-slice/reportSlice";
import { reportsDataReducer } from "./slices/subscription-slice/registeredMandateSlice";
import { DebitReportsDataReducer } from "./slices/subscription-slice/debitSlice";
import { createMandateReducer } from "./slices/subscription-slice/createMandateSlice";
import  approverDashboardSlice  from "./slices/approver-dashboard/approverDashboardSlice"
import rateMappingSlice from "./slices/approver-dashboard/rateMappingSlice"

const reducer = {
  auth: authReducer,
  message: messageReducer,
  dashboard: dashboardReducer,
  subscription: reducerSubscription,
  kyc: kycReducer,
  zone: merchantZoneMappingReducer,
  verifierApproverTab: merchantListReducer,
  kycOperationReducer: kycOperationReducer,
  payout: payoutReducer,
  menuListReducer: menuListReducer,
  productCatalogueSlice: productCatalogueSlice,
  ReferralMidReducer: ReferralMidReducer,
  challanReducer: challanReducer,
  merchantReportSlice: merchantReportSlice,

  // For subscription
  Reports: reportsDataReducer,
  DebitReports: DebitReportsDataReducer,
  createMandate: createMandateReducer,

  // approver
  approverDashboard: approverDashboardSlice,
  rateMappingSlice:rateMappingSlice
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;
