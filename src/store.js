import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import messageReducer from "./slices/message";
import { dashboardReducer } from "./slices/dashboardSlice";
import { reducerSubscription } from "./slices/subscription";
import { kycReducer } from "./slices/kycSlice";
import { merchantZoneMappingReducer } from "./slices/merchantZoneMappingSlice";
import { merchantListReducer } from "./slices/approverVerifierTabSlice";
import { kycOperationReducer } from "./slices/kycOperationSlice";
import { payoutReducer } from "./slices/payoutSlice";
import menuListReducer from "./slices/cob-dashboard/menulistSlice";
import productCatalogueSlice from "./slices/merchant-slice/productCatalogueSlice";
import { ReferralMidReducer } from "./slices/referralAndMidOperationSlice";
import { challanReducer } from "./slices/emamiSlice";
import merchantReportSlice from "./slices/merchant-slice/reportSlice";
import { reportsDataReducer } from "./slices/subscription-slice/registeredMandateSlice";
import { DebitReportsDataReducer } from "./slices/subscription-slice/debitSlice";
import { createMandateReducer } from "./slices/subscription-slice/createMandateSlice";
import approverDashboardSlice from "./slices/approver-dashboard/approverDashboardSlice";
import rateMappingSlice from "./slices/approver-dashboard/rateMappingSlice";
import merchantReferralOnboardReducer from "./slices/approver-dashboard/merchantReferralOnboardSlice";
import referralOnboardSliceReducer from "./slices/approver-dashboard/referral-onboard-slice";
// import notificationSlice from "./slices/notification-slice/notificationSlice"
import productSubscriptionServiceAdminReducer from "./slices/approver-dashboard/productSubscriptionServiceAdminSlice";
import { widgetReducer } from "./slices/widgetSlice";
import { themeReducer } from "./slices/theme/themeSlice";
import { signupDataReducer } from "./slices/signupDataSlice";
import { genreateMidReducer } from "./slices/generateMidSlice";
import { frmReducer } from "./slices/approver-dashboard/frmSlice";
import { forgotPassworReducer } from "./slices/forgotPasswordSlice";
import { assignAccountManagerReducer } from "./slices/assign-accountmanager-slice/assignAccountMangerSlice";
import { editKycDetailReducer } from "./slices/editKycSlice";
import { kycValidatorReducer } from "./slices/kycValidatorSlice";
import { bankDashboardReducer } from "./slices/bank-dashboard-slice/bankDashboardSlice";
import { infoBulletinReducer } from "./slices/infoBulletinSlice";
import { paymentLinkSliceReducer } from "./slices/paymentLink/paymentLinkSlice";
import { createEmandateByApiSliceReducer } from "./slices/subscription-slice/createEmandateSlice";
import { registrationHisorySliceReducer } from "./slices/subscription-slice/registrationHistorySlice";
import { mfaReducer } from "./components/ApproverNVerifier/Mfa/MfaSlice";

const reducer = {
  auth: authReducer,
  message: messageReducer,
  dashboard: dashboardReducer,
  subscription: reducerSubscription,
  kyc: kycReducer,
  zone: merchantZoneMappingReducer,
  signupData: signupDataReducer,
  mid: genreateMidReducer,
  forgotPassword: forgotPassworReducer,
  frm: frmReducer,
  widget: widgetReducer,
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
  createEmandateByApiSliceReducer: createEmandateByApiSliceReducer,
  registrationHisorySliceReducer: registrationHisorySliceReducer,

  // approver
  approverDashboard: approverDashboardSlice,
  rateMappingSlice: rateMappingSlice,

  //merchantOnboardByOps
  merchantReferralOnboardReducer: merchantReferralOnboardReducer,
  referralOnboard: referralOnboardSliceReducer,
  //notification
  // notificationSlice: notificationSlice,

  //   product subscription
  productSubscriptionServiceAdminReducer:
    productSubscriptionServiceAdminReducer,

  ///Edit Kyc Detail
  editKycDetailReducer: editKycDetailReducer,
  // theme
  themeReducer: themeReducer,
  //Assign-Account-Manager
  assignAccountManagerReducer: assignAccountManagerReducer,
  kycValidatorReducer: kycValidatorReducer,
  bankDashboardReducer: bankDashboardReducer,
  infoBulletinReducer: infoBulletinReducer,
  paymentLinkSliceReducer: paymentLinkSliceReducer,
  mfaReducer: mfaReducer,
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;
