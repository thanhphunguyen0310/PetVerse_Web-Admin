import apiClient from "./index";

export const getApplication = async (
  accessTokenR,
  pageNumber = 1,
  pageSize = 8,
  searchTerm = "",
  status
) => {
  try {
    const response = await apiClient.get("/Application", {
      params: {
        Status: status,
        PageIndex: pageNumber, 
        PageSize: pageSize, 
        SearchTerm: searchTerm, 
      },
      headers: {
        Authorization: `Bearer ${accessTokenR}`, // Add token to the request headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getApplicationDetail = async (accessTokenR, id) => {
  try {
    const response = await apiClient.get(`/Application/${id}`, {
      headers: {
        Authorization: `Bearer ${accessTokenR}`, // Add token to the request headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateApplication = async (
  accessTokenR,
  id,
  userId,
  roleId,
  status,
  cancelReason,
  isVerified
) => {
  try {
    const response = await apiClient.put(
      `/Application/${id}`,
      {
        id: id,
        userId: userId,
        roleId: roleId,
        status: status,
        cancelReason: cancelReason,
        isVerified: isVerified
      },
      {
        headers: {
          Authorization: `Bearer ${accessTokenR}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
