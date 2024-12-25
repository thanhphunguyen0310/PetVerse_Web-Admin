import apiClient from "./index.js";

export const getTransaction = async (accessToken, pageIndex, pageSize, status) => {
    try {
        const response = await apiClient.get("/Transaction", {
            params: {
                Status: status,
                PageIndex: pageIndex,
                PageSize: pageSize,
            },
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export const getTransactionDetail = async (id, accessToken) => {
    try {
      const response = await apiClient.get(`/Transaction/${id}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
