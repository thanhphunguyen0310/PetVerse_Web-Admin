import apiClient from "./index";
const accessToken = localStorage.getItem("accessToken");
export const getPetCenter = async (accessTokenR, pageNumber = 1, pageSize = 8, searchTerm = "", ) => {
    try {
      const response = await apiClient.get("/PetCenter", {
        headers: {
          Authorization: `Bearer ${accessTokenR}`,
        },
        params: {
          IgnoreDisabled: true,
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
export const getPetCenterDetail = async (accessTokenR, id) => {
  try {
    const response = await apiClient.get(`/PetCenter/${id}`,{
      headers: {
        Authorization: `Bearer ${accessTokenR}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const createPetSitter = async (values) => {
    try {
      const response = await apiClient.post(`/PetSitter`, values);
      return response.data;
    } catch (error) {
      console.error("Error creating data:", error);
      throw error;
    }
};
export const updatePetCenter = async (accessTokenR, id, petCenterData) => {
  try {
    const formData = new FormData();
    formData.append('PetCenterId', id);
    formData.append('Name', petCenterData.name);
    formData.append('Address', petCenterData.address);
    formData.append('PhoneNumber', petCenterData.phoneNumber);
    formData.append('Description', petCenterData.description);
    // Handle file (Avatar)
    if (petCenterData.avatar && petCenterData.avatar.fileList && petCenterData.avatar.fileList[0] && petCenterData.avatar.fileList[0].originFileObj) {
      formData.append('Image', petCenterData.avatar.fileList[0].originFileObj);
    }
    await apiClient.put(`/PetCenter/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${accessTokenR}`,
        'Content-Type': 'multipart/form-data',
      },
    }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}
export const disablePetCenter = async (accessTokenR, id) => {
  try {
    await apiClient.delete(`/PetCenter/${id}`, {
      headers: {
        Authorization: `Bearer ${accessTokenR}`,
      },
    });
  } catch (error) {
    console.error("Error disabling user:", error);
    throw error;
  }
}
export const getTopCenter = async (accessTokenR, month, yeart) => {
  try {
    const response = await apiClient.get(`/PetCenter/Top5PetCenter`, {
      params:{
        Month: month,
        Year: yeart,
      },
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