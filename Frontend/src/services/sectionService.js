import api from "../axiosSetup";

const sectionService = {
    createSection: (data) => api.post("/api/v1/sections", data),
    getSectionsByClass: (classId) => api.get(`/api/v1/sections`, { params: { classId } }),
};

export default sectionService;