import api from "../axiosSetup";

const subjectService = {
    createSubject: (data) => api.post("/api/v1/subjects", data),
    getSubjects: () => api.get("/api/v1/subjects"),
    updateSubject: (id, data) => api.put(`/api/v1/subjects/${id}`, data),
    deleteSubject: (id) => api.delete(`/api/v1/subjects/${id}`),
};

export default subjectService;
