import apiClient from "./index";

export const getAppointmetList = async (
    accessToken,
    // status,
    pageIndex,
    pageSize,
    searchTerm) => {
    try {
        const response = await apiClient.get(`/Appointment`, {
            params: {
                // Status: status,
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
export const getAppointmentDetails = async (accessToken, id, type) => {
    try {
        const response = await apiClient.get(`/Appointment/${id}`, {
            params: {
                Type: type,
            },
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};


export const updatePet = async (accessToken, id, formData) => {
    try {
        const response = await apiClient.put(`/Pet/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating data:", error.data.message);
        throw error;
    }
}

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