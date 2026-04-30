import api from "../axiosSetup";

const studentService = {
    // Student Master APIs
    addStudent: (data) => api.post("/api/v1/student/add", data),
    getStudents: () => api.get("/api/v1/student/getStudents"),
    getStudentById: (id) => api.get(`/api/v1/student/${id}`),
    updateStudent: (id, data) => api.put(`/api/v1/student/${id}`, data),
    deleteStudent: (id) => api.delete(`/api/v1/student/${id}`),

    // Enrollment APIs
    enrollStudent: (data) => api.post("/api/v1/student/enroll", data),
    getEnrolledStudents: (params) => api.get("/api/v1/student/get-enrollemnts", { params }),
    getCurrentEnrollment: (params) => api.get("/api/v1/student/get-current-enrollment", { params }),
    getEnrollmentHistory: (studentId) => api.get("/api/v1/student/enrollmentHistory", { params: { studentId } }),
    changeSection: (data) => api.post("/api/v1/student/change-section", data),

    // Promotion API
    promoteStudents: (data) => api.post("/api/v1/student/promot-students", data),
};

// Named export for dynamic import
export const enrollStudent = studentService.enrollStudent;

export default studentService;
