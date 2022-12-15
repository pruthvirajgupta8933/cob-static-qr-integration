import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/auth";
import messageReducer from "./slices/message";
// import homeReducer from './slices/home'
import { dashboardReducer } from './slices/dashboardSlice';
import reducerSubscription from './slices/subscription'
// import KycOtpSlice from "./slices/kycOtp"
import { kycReducer } from './slices/kycSlice';
import {merchantZoneMappingReducer} from './slices/merchantZoneMappingSlice'
import { merchantListReducer } from './slices/approverVerifierTabSlice';
import { kycOperationReducer } from './slices/kycOperationSlice';




const reducer = {
  auth: authReducer,
  message: messageReducer,
  dashboard:dashboardReducer,
  subscription:reducerSubscription,
  kyc:kycReducer,
  zone:merchantZoneMappingReducer,
  verifierApproverTab:merchantListReducer,
  kycOperationReducer:kycOperationReducer
}

const store = configureStore({
  reducer: reducer,
  devTools: true,
})


export default store;
