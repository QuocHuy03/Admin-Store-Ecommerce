import store from "../../redux/store";
import Http from "../http";

const http = new Http();

export const fetchAllColors = async () => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.get(`/getAllColors`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchPostColor = async (data) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.post("/addColor", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchUpdateColor = async (id, data) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.update(`/updateColor/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchDeleteColor = async (id) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.delete(`/deleteColor/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchDeleteColorsAll = async (id) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.delete(`/deleteColorsAll`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchDeleteColorsByIds = async (data) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.delete(`/deleteColorsByIds`, { data });
    return response;
  } catch (error) {
    console.error(error);
  }
};
