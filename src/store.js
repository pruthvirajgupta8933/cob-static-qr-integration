import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/auth";
import messageReducer from "./slices/message";
import homeReducer from './slices/home'
import { dashboardReducer } from './slices/dashboardSlice';
import reducerProfile from './slices/profileSlice'

const reducer = {
  auth: authReducer,
  message: messageReducer,
  dashboard:dashboardReducer,
  profileReducer:reducerProfile,
}

const store = configureStore({
  reducer: reducer,
  devTools: true,
})

export default store;
