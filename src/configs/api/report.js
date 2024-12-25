import apiClient from "./index";

export const getReportList = async (accessToken, pageIndex, pageSize, searchTerm) => {
    try {
        const response = await apiClient.get("/Report", {
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
}
export const getReportDetails = async (accessToken, id) => {
    try {
        const response = await apiClient.get(`/Report/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};
export const updateReport = async (accessToken, id, status) =>{
    try {
        const response = await apiClient.put(`/Report/${id}`, {
            id,
            status,
        }, 
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}