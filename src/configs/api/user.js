import apiClient from "./index";
const accessToken = localStorage.getItem("accessToken");
export const getUser = async (
  accessTokenR,
  pageNumber = 1,
  pageSize = 8,
  searchTerm = ""
) => {
  try {
    const response = await apiClient.get("/User", {
      params: {
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
export const getUserDetails = async (accessTokenR, id) => {
  try {
    const response = await apiClient.get(`/User/${id}`, {
      headers: {
        Authorization: `Bearer ${accessTokenR}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
export const updateUser = async (accessTokenR, id, userData) => {
  try {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('FullName', userData.fullName);
    formData.append('Gender', userData.gender);
    formData.append('DateOfBirth', userData.dateOfBirth);
    formData.append('Address', userData.address);
    // Handle file (Avatar)
    if (userData.avatar && userData.avatar.fileList && userData.avatar.fileList[0] && userData.avatar.fileList[0].originFileObj) {
      formData.append('Avatar', userData.avatar.fileList[0].originFileObj);
    }
    formData.append('PhoneNumber', userData.phoneNumber);
    await apiClient.put(`/User/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
export const disableUser = async (accessTokenR, id) => {
  try {
    await apiClient.delete(`/User/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("Error disabling user:", error);
    throw error;
  }
}
export const createUser = async (data) => {
  try {
    await apiClient.post(`/User`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("Error disabling user:", error);
    throw error;
  }
}