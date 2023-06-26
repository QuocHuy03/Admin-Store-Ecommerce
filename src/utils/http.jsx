import axios from "axios";

class Http {
  constructor() {
    this.huydev = axios.create({
      baseURL: "http://localhost:8080/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async get(url, params) {
    try {
      const response = await this.huydev.get(url, { params });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to make GET request.");
    }
  }

  async post(url, data) {
    try {
      const response = await this.huydev.post(url, data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to make POST request.");
    }
  }

  async update(url, data, slug) {
    try {
      const response = await this.huydev.put(url, { data, slug });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to make PUT request.");
    }
  }

  async delete(url, id) {
    try {
      const response = await this.huydev.delete(url, { data: { id } });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to make DELETE request.");
    }
  }
}

export default Http;
