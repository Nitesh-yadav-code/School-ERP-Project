import axios from "axios";


const api = axios.create({
    baseURL: "https://school-erp-system-45i6.onrender.com/"
})


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
})

export default api;
