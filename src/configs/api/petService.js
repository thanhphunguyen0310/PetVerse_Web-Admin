import apiClient from "./index";

export const getPetService = async (accessToken) => {
    try {
        const response = await apiClient.get("/PetService",{
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
 
}