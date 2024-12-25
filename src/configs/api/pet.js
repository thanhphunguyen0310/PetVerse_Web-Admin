import apiClient from "./index";

export const getPets = async (accessToken, pageIndex, pageSize, searchTerm) => {
    try {
        const response = await apiClient.get(`/Pet`, {
            params: {
                IncludeDeleted: false,
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
}
export const getPetDetails = async (accessToken, id) => {
    try {
        const response = await apiClient.get(`/Pet/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export const updatePet = async (accessToken, id, formData) => {
    try {
        const response = await apiClient.put(`/Pet/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            },
            maxContentLength: 10 * 1024 * 1024, 
            maxBodyLength: 10 * 1024 * 1024, 
        });
        return response.data;
    } catch (error) {
        console.error("Error updating data:", error.response?.data?.message || error.message);
        throw error;
    }
};


export const deletePet = async (accessToken, id) => {
    try {
        await apiClient.delete(`/Pet/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    } catch (error) {
        console.error("Error deleting data:", error);
        throw error;
    }
}