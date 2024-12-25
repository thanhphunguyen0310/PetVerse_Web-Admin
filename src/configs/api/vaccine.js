import apiClient from "./index";

export const getVaccineList = async (
    accessToken,
    pageIndex,
    pageSize,
    searchTerm
) => {
    try {
        const response = await apiClient.get(`/Vaccine`, {
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
export const getVaccineDetails = async (accessToken, id) => {
    try {
        const response = await apiClient.get(`/Vaccine/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};
export const createVaccine = async (accessToken, values) => {
    try {
      const response = await apiClient.post(`/Vaccine`, values,{
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating data:", error);
      throw error;
    }
};
export const updateVaccine = async (accessToken, id, values) => {
  try {
    const response = await apiClient.put(`/Vaccine/${id}`, values,{
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating data:", error);
    throw error;
  }
};
export const deleteVaccine = async (accessToken, id) => {
    try {
      const response = await apiClient.delete(`/Vaccine/${id}`,{
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating data:", error);
      throw error;
    }
};
