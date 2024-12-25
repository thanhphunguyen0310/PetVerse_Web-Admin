import apiClient from "./index";

export const getBreedBySpecies = async (accessToken, speciesId, breedId) => {
    try {
        const response = await apiClient.get(`/Species/${speciesId}/Breed/${breedId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
    throw error;
    }
}
export const getSpecies = async (accessToken) => {
    try {
        const response = await apiClient.get(`/Species`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
    throw error;
    }
}