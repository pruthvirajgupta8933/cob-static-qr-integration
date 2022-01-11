import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/auth";
import messageReducer from "./slices/message";
import homeReducer from './slices/home'
import counterReducer from './slices/counterSlice'

const reducer = {
  auth: authReducer,
  message: messageReducer,
  counter:counterReducer
}

const store = configureStore({
  reducer: reducer,
  devTools: true,
})

export default store;
