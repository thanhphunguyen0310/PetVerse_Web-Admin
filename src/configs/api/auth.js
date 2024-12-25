import apiClient from './index'
export const loginApi = async (value) => {
    const response = await apiClient.post("/Auth/Login", value);
    return response.data;
  };