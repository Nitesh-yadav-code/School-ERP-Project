import api from "../axiosSetup";

const todoService = {
    getTodos: () => api.get("/api/todo"),
    addTodo: (data) => api.post("/api/todo/add", data),
    updateTodo: (id, data) => api.put(`/api/todo/update/${id}`, data),
    deleteTodo: (id) => api.delete(`/api/todo/delete/${id}`),
};

export default todoService;