import store from "../../redux/store";
import Http from "../http";

const http = new Http();

export const fetchAllProducts = async () => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.get(`/getAllProducts`);
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

export const fetchProductBySlug = async (slug) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.get(`/getProductBySlug/${slug}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchPostProduct = async (data) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.post("/addProduct", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchUpdateProduct = async (slug, data) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.update(`/updateProduct/${slug}`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchDeleteProduct = async (id) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.delete(`/deleteProduct/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchDeleteProductesAll = async (id) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.delete(`/deleteProductsAll`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchDeleteProductsByIds = async (data) => {
  try {
    const state = store.getState();
    const accessToken = state.auth.user.accessToken;
    http.setAccessToken(accessToken);
    const response = await http.delete(`/deleteProductsByIds`, { data });
    return response;
  } catch (error) {
    console.error(error);
  }
};
