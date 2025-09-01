import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';

// import from "./slices/auth";
import authReducer, { logout } from "./slices/auth";
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
import { qFormSliceReducer } from "./slices/qform-reports";
import { createEmandateByApiSliceReducer } from "./slices/subscription-slice/createEmandateSlice";
import { registrationHisorySliceReducer } from "./slices/subscription-slice/registrationHistorySlice";
import { ckycrReducer } from "./components/ApproverNVerifier/backend-kyc/slice/ckycr.slice";
import { dateFilterSliceReducer } from "./slices/date-filter-slice/DateFilterSlice"
import { paymentLinkSolutionSliceReducer } from "./components/dashboard/AllPages/payment-link-solution/paylink-solution-slice/paylinkSolutionSlice";
import { merchantAssignedReducer } from "./components/BusinessDevlopment/businessDevelopmentSlice/BusinessDevelopmentSlice";
import { mfaReducer } from "./components/ApproverNVerifier/Mfa/MfaSlice";
import { assignBdReducer } from "./components/ApproverNVerifier/AssignBusinessDevelopment/bdSlice.js/bdSlice";
import { scheduleTransactionSliceReducer } from "./slices/subscription-slice/scheduleTransactionSlice";
import { updateSettlementApiSliceReducer } from "./slices/subscription-slice/updateSettlementSlice";
import sabqrReducer from "./slices/sabqr/sabqrSlice";

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
  scheduleTransactionSliceReducer: scheduleTransactionSliceReducer,
  updateSettlementApiSliceReducer: updateSettlementApiSliceReducer,

  // approver
  approverDashboard: approverDashboardSlice,
  rateMappingSlice: rateMappingSlice,
  ckycrReducer: ckycrReducer,

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
  merchantAssignedReducer: merchantAssignedReducer,
  dateFilterSliceReducer: dateFilterSliceReducer,
  /// Payment Link Solution

  paymentLinkSolutionSliceReducer: paymentLinkSolutionSliceReducer,
  qForm: qFormSliceReducer,
  mfaReducer: mfaReducer,
  assignBdReducer: assignBdReducer,
  sabqr: sabqrReducer

};

const rootPersistConfig = {
  key: 'cob-root',
  storage,
  version: 1.1, // Increment this version number when you change the structure of your state
  whitelist: [
    // 'auth', 
    // 'dashboard', 
    // 'kyc', 
    // 'widget', 
    // 'verifierApproverTab', 
    // 'signupData', 
    // 'mid', 
    // 'frm', 
    // 'themeReducer', 
    // 'kycOperationReducer', 
    // 'payout', 
    'menuListReducer',
    // 'productCatalogueSlice', 
    // 'ReferralMidReducer', 
    // 'challanReducer', 
    // 'merchantReportSlice', 
    // 'createMandate', 
    // 'Reports', 
    // 'DebitReports', 
    // 'createEmandateByApiSliceReducer', 
    // 'registrationHisorySliceReducer', 
    // 'scheduleTransactionSliceReducer'
  ], // Only persist these slices
};

// Combine all your reducers into a single rootReducer
const rootReducer = combineReducers(reducer);

const rootReducerWithLogout = (state, action) => {
  // console.log("Action Type:", action.type); // Log the action type
  // console.log("Logout Fulfilled Type:", logout.fulfilled.type); // Log the logout fulfilled type

  if (action.type === logout.fulfilled.type) { // Compare action.type with logout.fulfilled.type
    state = undefined; // Reset the state
  }
  return rootReducer(state, action);
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducerWithLogout);

const store = configureStore({
  reducer: persistedReducer, // Use the persistedReducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializability checks, as redux-persist uses them
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production', // Enable DevTools only in development
});

export const persistor = persistStore(store);

// To maintain the default export if other parts of your application expect it:
export default store;
