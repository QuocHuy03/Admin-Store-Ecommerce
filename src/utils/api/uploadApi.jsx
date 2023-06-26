import Http from "../http";

const http = new Http();

export const fetchPostUpload = async (formData) => {
  try {
    const response = await http.post(`/uploadFile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
