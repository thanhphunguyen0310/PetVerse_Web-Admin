import apiClient from "./index.js";
export const createPlace = async (accessToken, values) => {
    try {
      const response = await apiClient.post(`/Place`, values,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }); 
      return response.data;
    } catch (error) {
      console.error("Error creating data:", error);
      throw error;
    }
};

export const getPlaceList = async (
  accessToken,
  pageIndex,
  pageSize,
  searchTerm
) => {
  try {
      const response = await apiClient.get(`/Place`, {
          params: {
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
export const getPlaceDetails = async (accessToken, id) => {
  try {
      const response = await apiClient.get(`/Place/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
  } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
  }
};
export const deletePlace = async (accessToken, id) => {
  try {
    const response = await apiClient.delete(`/Place/${id}`,{
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating data:", error);
    throw error;
  }
};