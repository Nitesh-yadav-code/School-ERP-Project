import api from "../axiosSetup";

const feeService = {
    // Fee Setup (simple per-class fees)
    createFeeSetup: (data) => api.post("/api/v1/feeSetup", data),
    getFeeByClass: (classId) => api.get(`/api/v1/fee-structure/${classId}`),
    updateFeeSetup: (classId, data) => api.put(`/api/v1/feeSetup/${classId}`, data),

    // Fee Structure (detailed fee types per class/year)
    createFeeStructure: (data) => api.post("/api/v1/fee-structure", data),
    getFeeStructures: (params) => api.get("/api/v1/fee-structure", { params }),
    updateFeeStructure: (id, data) => api.put(`/api/v1/fee-structure/${id}`, data),
    deleteFeeStructure: (id) => api.delete(`/api/v1/fee-structure/${id}`),

    // Fee Assignments (assign fees to students)
    assignFees: (data) => api.post("/api/v1/fee-assignment/assign", data),
    getFeesByEnrollment: (enrollmentId) => api.get(`/api/v1/fee-assignment/enrollment/${enrollmentId}`),
    updateFeeAssignment: (id, data) => api.put(`/api/v1/fee-assignment/${id}`, data),
    deleteFeeAssignment: (id) => api.delete(`/api/v1/fee-assignment/${id}`),

    // Fee Payments
    makePayment: (data) => api.post("/api/v1/fee-payment/pay", data),
    getPaymentsByAssignment: (assignmentId) => api.get(`/api/v1/fee-payment/assignment/${assignmentId}`),

    // Legacy endpoints
    payFees: (data) => api.post("/api/v1/fees/pay", data),
    getFeesByStudent: (studentId) => api.get(`/api/v1/fees/student/${studentId}`),
    getFeeReport: () => api.get("/api/v1/fees/report"),
};

export default feeService;
