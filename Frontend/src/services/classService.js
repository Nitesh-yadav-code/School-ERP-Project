import api from "../axiosSetup";

const classService = {
    createClass: (data) => api.post("/api/v1/classes", data),
    getClasses: () => api.get("/api/v1/classes"),
};

export default classService;
