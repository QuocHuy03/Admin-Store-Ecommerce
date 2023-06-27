import Http from "../http";

const http = new Http();

export const postLogin = async (data) => {
  try {
    const response = await http.post("/login", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};
