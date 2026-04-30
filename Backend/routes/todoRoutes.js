import express from 'express'
import { addTodo, deleteTodo, getTodo, updatedTodoupdateTodo } from '../controller/todoController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/todo',authMiddleware, getTodo);
router.post('/todo/add',authMiddleware, addTodo);
router.put('/todo/update/:id',authMiddleware, updatedTodoupdateTodo);
router.delete('/todo/delete/:id',authMiddleware, deleteTodo);

export default router;