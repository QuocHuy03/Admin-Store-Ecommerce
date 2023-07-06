import store from "../../redux/store";
import Http from "../http";

const http = new Http();

export const fetchAllOrders = async () => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.get(`/getAllOrders`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchOrderBySlug = async (slug) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.get(`/getOrderBySlug/${slug}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchPostOrder = async (data) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.post("/postOrder", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};


export const fetchDeleteOrder = async (id) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.delete(`/deleteOrder/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchDeleteOrdersAll = async (id) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.delete(`/deleteOrdersAll`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchDeleteOrdersByIds = async (data) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.delete(`/deleteOrdersByIds`, { data });
    return response;
  } catch (error) {
    console.error(error);
  }
};
