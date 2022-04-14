import { configureStore } from '@reduxjs/toolkit';
import authenticateReducer from '../features/authenticateSlice';
import loadingReducer from "../features/loadingSlice";
import userReducer from '../features/userSlice';
import fileReducer from '../features/fileSlice';
import currentReducer from '../features/currentSlice';

export const store = configureStore({
  reducer: {
    authenticate: authenticateReducer,
    loading: loadingReducer,
    user: userReducer,
    file: fileReducer,
    current: currentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
})