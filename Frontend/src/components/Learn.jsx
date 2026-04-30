import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import todoService from "../services/todoService";

const Learn = () => {
  const { isLoggedIn } = useContext(UserContext);
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [todoId, setTodoId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);



  const getAllTodos = async () => {
    try {
      const res = await todoService.getTodos();
      setTodos(res.data.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getAllTodos();
    }
  }, [isLoggedIn]);

  const handleAddOrUpdate = async () => {
    const title = task;
    if (!title) return alert("Please enter a todo");
    let res;
    try {
      if (isEdit && todoId) {
        res = await todoService.updateTodo(todoId, { title });
      } else {
        res = await todoService.addTodo({ title });
      }

      if (res.status >= 200 && res.status < 300) {
        alert("Success");
        getAllTodos();
        setIsEdit(false);
        setTodoId(null);
        setTask("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (index) => {
    const toUpdateTask = todos[index].title;
    setTodoId(todos[index]._id);
    setTask(toUpdateTask);
    setIsEdit(true);
  };

  const handleDelete = async (index) => {
    const idTodelete = todos[index]._id;
    if (!idTodelete) alert("Todo id not found");
    try {
      const res = await todoService.deleteTodo(idTodelete);

      if (res.status === 200) {
        alert("Todo deleted Successfully");
        getAllTodos();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mb: 4,
        alignItems: "center",
        mt: 12,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }}>
        Todo Management
      </Typography>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {isLoggedIn
            ? "Welcome! Manage Your Todos"
            : "Please log in to manage your todos"}
        </Typography>

        {/* Only show todo UI when logged in */}
        {isLoggedIn && (
          <Box sx={{ mt: 3, width: "300px", margin: "auto" }}>
            <TextField
              fullWidth
              label="Enter Todo"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleAddOrUpdate}
            >
              {isEdit ? "Update Todo" : "Add Todo"}
            </Button>

            <Box sx={{ mt: 4 }}>
              {todos.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    border: "1px solid #ccc",
                    p: 1,
                    mt: 1,
                    borderRadius: "6px",
                  }}
                >
                  <span>{item.title}</span>

                  <Box>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Learn;
