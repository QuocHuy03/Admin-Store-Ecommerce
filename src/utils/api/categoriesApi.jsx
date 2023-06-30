import store from "../../redux/store";
import Http from "../http";
import { message } from "antd";

const http = new Http();

export const fetchAllCategories = async () => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.get(`/getAllCategories`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

// export const fetchAllCategoriesPage = async (page, limit) => {
//   try {
//     const state = store.getState();
//     const accessToken = state.auth.user.accessToken;
//     http.setAccessToken(accessToken);
//     const response = await http.get(
//       `/getAllCategories?page=${page}&limit=${limit}`
//     );
//     if (response.status === false) {
//       message.error(`${response.message}`);
//     } else {
//       return response;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

export const fetchCategoryBySlug = async (slug) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.get(`/getCategoryBySlug/${slug}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchPostCategory = async (data) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.post("/addCategory", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchUpdateCategory = async (slug, data) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.update(`/updateCategory/${slug}`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchDeleteCategory = async (id) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.delete(`/deleteCategory/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchDeleteCategoriesAll = async (id) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.delete(`/deleteCategoriesAll`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchDeleteCategoriesByIds = async (data) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.delete(`/deleteCategoriesByIds`, { data });
    return response;
  } catch (error) {
    console.error(error);
  }
};
