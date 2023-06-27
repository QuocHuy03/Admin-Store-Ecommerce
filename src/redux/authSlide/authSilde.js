import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerSuccess: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.error = action.payload.error;
    },

    registerError: (state, action) => {
      state.user = null;
      state.isLoggedIn = true;
      state.error = action.payload.message;
    },

    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.error = action.payload.error;
    },

    loginError: (state, action) => {
      state.user = null;
      state.isLoggedIn = true;
      state.error = action.payload.message;
    },

    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
  },
});

export const {
  registerSuccess,
  registerError,
  loginSuccess,
  loginError,
  logout,
} = authSlice.actions;

export const userSelector = (state) => state.auth;

export default authSlice.reducer;
