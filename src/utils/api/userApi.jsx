import store from "../../redux/store";
import Http from "../http";

const http = new Http();

export const fetchAllUsers = async () => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.get(`/getAllUsers`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchUpdateUser = async (slug, data) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.update(`/updateUser/${slug}`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchDeleteUser = async (id) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.delete(`/deleteUser/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
