/* eslint-disable @typescript-eslint/no-explicit-any */
import api from ".";
import { BASE_URL } from "../config/constant";

interface LoginParams {
  email: string;
  password: string;
}
const ApiUtils = {
  authLogin: async function (value: LoginParams) {
    try {
      const response = await api.post(`${BASE_URL}admin/login`, value);
      return response;
    } catch (error: any) {
      throw error.response;
    }
  },
  getSingleUser: async function (userId: string) {
    try {
      const response = await api.get(`${BASE_URL}admin/find/${userId}`);
      return response.data;
    } catch (error: any) {
      throw error.response;
    }
  },
};

export default ApiUtils;
