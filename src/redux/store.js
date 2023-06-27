import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import { loginThunk } from "./thunk/authThunk";
import { authSlice } from "./authSlide/authSilde";

const authPersistConfig = {
  key: "auth",
  storage: storage,
};

const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authSlice.reducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: [thunk],
});

store.dispatch(loginThunk);

export const persistor = persistStore(store);
export default store;
