import api from "../axiosSetup";

const classSubjectService = {
    // Class-Subject mappings
    createClassSubject: (data) => api.post("/api/v1/class-subjects", data),
    getClassSubjects: (params) => api.get("/api/v1/class-subjects", { params }),
};

export default classSubjectService;
