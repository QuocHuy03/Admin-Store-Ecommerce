import axios from "axios";
import { httpApi } from "../dev";

class Http {
  constructor() {
    this.huydev = axios.create({
      baseURL: `${httpApi}/api/admin`,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.accessToken = null;
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
    this.createHeader(accessToken);
  }

  createHeader(token) {
    if (token) {
      this.huydev.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.huydev.defaults.headers.common["Authorization"];
    }
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
