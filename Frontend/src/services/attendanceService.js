import api from "../axiosSetup";

const attendanceService = {
    // Mark attendance for multiple students
    markAttendance: (data) => api.post("/api/v1/attendance/mark", data),

    // Get attendance by class (with filters)
    getAttendanceByClass: (params) => api.get("/api/v1/attendance/class", { params }),

    // Get student attendance history
    getAttendanceByStudent: (params) => api.get("/api/v1/attendance/student-attendance", { params }),
};

export default attendanceService;
