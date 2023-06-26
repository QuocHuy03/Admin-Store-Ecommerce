import Http from "../http";

const http = new Http();

export const fetchAllCategories = async () => {
  try {
    const response = await http.get(`/getAllCategories`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchAllCategoriesPage = async (page, limit) => {
  try {
    const response = await http.get(
      `/getAllCategories?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchCategoryBySlug = async (slug) => {
  try {
    const response = await http.get(`/getCategoryBySlug/${slug}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchPostCategory = async (data) => {
  try {
    const response = await http.post("/addCategory", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchUpdateCategory = async (slug, data) => {
  try {
    const response = await http.update(`/updateCategory/${slug}`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchDeleteCategory = async (id) => {
  try {
    const response = await http.delete(`/deleteCategory/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
