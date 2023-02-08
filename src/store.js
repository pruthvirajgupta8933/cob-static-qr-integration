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
import  menuListReducer from "./slices/cob-dashboard/menulistSlice"
import productCatalogueSlice  from "./slices/merchant-slice/productCatalogueSlice"



const reducer = {
  auth: authReducer,
  message: messageReducer,
  dashboard: dashboardReducer,
  subscription: reducerSubscription,
  kyc: kycReducer,
  zone: merchantZoneMappingReducer,
  verifierApproverTab: merchantListReducer,
  kycOperationReducer: kycOperationReducer,
  payout:payoutReducer,
  menuListReducer:menuListReducer,
  productCatalogueSlice:productCatalogueSlice
};


const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;
