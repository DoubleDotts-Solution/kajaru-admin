import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slice/auth.slice";
import userReducer from "./slice/user.slice";
import { mainApi } from "./slice/mainApiSlice";

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  [mainApi.reducerPath]: mainApi.reducer,
});

// Configure the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mainApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
