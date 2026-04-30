import api from "../axiosSetup";

const dashboardService = {
    getDashboardStats: (academicYear) => api.get(`/api/v1/dashboard/stats`, { params: { academicYear } }),
};

export default dashboardService;
