import api from "../axiosSetup";

const teacherService = {
    // Teacher CRUD
    createTeacher: (data) => api.post("/api/v1/teachers", data),
    getTeachers: () => api.get("/api/v1/teachers"),
    getTeacherById: (id) => api.get(`/api/v1/teachers/${id}`),
    updateTeacher: (id, data) => api.put(`/api/v1/teachers/${id}`, data),
    deleteTeacher: (id) => api.delete(`/api/v1/teachers/${id}`),

    // Teacher Assignments
    assignTeacher: (data) => api.post("/api/v1/teacher-assignments", data),
    getTeacherAssignments: (params) => api.get("/api/v1/teacher-assignments", { params }),
};

export default teacherService;
