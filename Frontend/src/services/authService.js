import api from "../axiosSetup";

const authService = {
    login: (data) => api.post("/api/v1/auth/user/login", data),
    signup: (data) => api.post("/api/user/signup", data),
    getUserById: (id) => api.get(`/api/getUsers/${id}`),
    updateUser: (id, data) => api.put(`/api/v1/auth/updateUser/${id}`, data),
    getUsers: () => api.get(`/api/v1/auth/users`),
};

export default authService;