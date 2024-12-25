import apiClient from "./index";
const accessToken = localStorage.getItem("accessToken");
export const getRole = async () => {
    try {
      const response = await apiClient.get("/Role",{
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };