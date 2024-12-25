import apiClient from "./index";
export const getPetCenterService = async (pageNumber = 1, pageSize = 8, searchTerm = "") => {
  try {
    const response = await apiClient.get("/PetService", {
      params: {
        PageIndex: pageNumber,
        PageSize: pageSize,
        SearchTerm: searchTerm,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getPetCenterServiceDetails = async (accessToken, id) => {
  try {
    const response = await apiClient.get(`/PetCenterService/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};