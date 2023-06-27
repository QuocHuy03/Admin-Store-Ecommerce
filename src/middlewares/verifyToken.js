import axios from "axios";
import { httpApi } from "../dev";

export const verifyToken = async (token) => {
  try {
    const response = await axios.get(`${httpApi}/api/verifyAccessToken`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Request failed:", error);
  }
};
