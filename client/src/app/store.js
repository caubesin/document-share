import { configureStore } from '@reduxjs/toolkit';
import authenticateReducer from '../features/authenticateSlice';
import loadingReducer from "../features/loadingSlice"

export const store = configureStore({
  reducer: {
    authenticate: authenticateReducer,
    loading: loadingReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
})