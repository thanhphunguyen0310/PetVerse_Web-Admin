import apiClient from "./index";

export const getBreeding = async (
  accessToken,
  status,
  pageIndex,
  pageSize,
  searchTerm
) => {
  try {
    const response = await apiClient.get(`/CenterBreed`, {
      params: {
        Status: status,
        PageIndex: pageIndex,
        PageSize: pageSize,
        SearchTerm: searchTerm,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getPetBreedingDetails = async (accessToken, id) => {
  try {
    const response = await apiClient.get(`/CenterBreed/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateBreedingApplication = async (accessToken, id, status, cancelReason) => {
  try {
    const response = await apiClient.put(
      `/CenterBreed/${id}`,
      {
        id,
        status,
        cancelReason
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Place headers here
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
