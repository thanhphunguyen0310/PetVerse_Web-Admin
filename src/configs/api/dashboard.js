import apiClient from './index'

// admin dashboard
export const adminCardOverview = async (accessToken) => {
    try {
        const response = await apiClient.get('/Dashboard/Admin/OverView', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}
// admin line chart
export const lineChart = async (accessToken) => {
    try {
        const response = await apiClient.get('/Dashboard/Admin/LineChart', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}
// admin pie chart
export const pieChart = async (accessToken) => {
    try {
        const response = await apiClient.get('/Dashboard/Admin/PipeChart', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}
// admin bar chart
export const barChart = async (accessToken) => {
    try {
        const response = await apiClient.get('/Dashboard/Admin/BarChart', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}
// admin summary table
export const summaryTable = async (accessToken) => {
    try {
        const response = await apiClient.get('/Dashboard/Admin/SummeryTable', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}
// manager card overview
export const managerCardOverview = async (accessToken) => {
    try {
        const response = await apiClient.get('/Dashboard/Manager/OverView', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}
// manager line chart
export const managerLineChart = async (accessToken) => {
    try {
        const response = await apiClient.get('/Dashboard/Manager/LineChart', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}
// manager bar chart
export const managerBarChart = async (accessToken) => {
    try {
        const response = await apiClient.get('/Dashboard/Manager/BarChart', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}