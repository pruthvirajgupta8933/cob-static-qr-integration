import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import messageReducer from "./slices/message";
<<<<<<< HEAD
import { dashboardReducer } from "./slices/dashboardSlice";
import reducerSubscription from "./slices/subscription";
import { kycReducer } from "./slices/kycSlice";
import { merchantZoneMappingReducer } from "./slices/merchantZoneMappingSlice";
import { merchantListReducer } from "./slices/approverVerifierTabSlice";
import { kycOperationReducer } from "./slices/kycOperationSlice";
import { payoutReducer } from "./slices/payoutSlice";
=======
import { dashboardReducer } from './slices/dashboardSlice';
import reducerSubscription from './slices/subscription'
import { kycReducer } from './slices/kycSlice';
import {merchantZoneMappingReducer} from './slices/merchantZoneMappingSlice'
import { merchantListReducer } from './slices/approverVerifierTabSlice';
import { kycOperationReducer } from './slices/kycOperationSlice';
import  menuListReducer from "./slices/cob-dashboard/menulistSlice"
import productCatalogueSlice  from "./slices/merchant-slice/productCatalogueSlice"


>>>>>>> 11706d1d23156a1aa4251b44f6197d08b09d77b6

const reducer = {
  auth: authReducer,
  message: messageReducer,
<<<<<<< HEAD
  dashboard: dashboardReducer,
  subscription: reducerSubscription,
  kyc: kycReducer,
  zone: merchantZoneMappingReducer,
  verifierApproverTab: merchantListReducer,
  kycOperationReducer: kycOperationReducer,
  payout:payoutReducer
};
=======
  dashboard:dashboardReducer,
  subscription:reducerSubscription,
  kyc:kycReducer,
  zone:merchantZoneMappingReducer,
  verifierApproverTab:merchantListReducer,
  kycOperationReducer:kycOperationReducer,
  menuListReducer:menuListReducer,
  productCatalogueSlice:productCatalogueSlice
}
>>>>>>> 11706d1d23156a1aa4251b44f6197d08b09d77b6

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;
