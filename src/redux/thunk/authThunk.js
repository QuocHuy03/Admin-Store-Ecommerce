import { createAsyncThunk } from "@reduxjs/toolkit";
import { postLogin } from "../../utils/api/authApi";
import { verifyToken } from "../../middlewares/verifyToken";
import { loginError, loginSuccess } from "../authSlide/authSilde";
import { message } from "antd";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data, { dispatch }) => {
    try {
      const response = await postLogin(data);
      if (response.status === true) {
        // const user = await verifyToken(response.accessToken);
        if (response.role === "ADMIN") {
          dispatch(loginSuccess(response));
          message.success(`${response.message}`);
          return response;
        } else {
          message.error("Không Đủ Quyền");
        }
      } else {
        dispatch(loginError(response));
        message.error(`${response.message}`);
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(loginError(error));
      throw new Error(error);
    }
  }
);
