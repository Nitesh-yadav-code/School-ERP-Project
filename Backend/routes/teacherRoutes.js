
import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantMiddleware } from '../middleware/tenantMiddleware.js';
import { permissionMiddleware } from '../middleware/permissionMiddleware.js';
import { createTeacher, getTeacherById, getTeachers, updateTeacher } from '../controller/teacherController.js';

const router = express.Router();
router.post('/', authMiddleware, tenantMiddleware(), permissionMiddleware(["TEACHER_CREATE"]), createTeacher)
router.get('/', authMiddleware,  tenantMiddleware(), permissionMiddleware(["TEACHER_VIEW"]), getTeachers)
router.get('/:id', authMiddleware, tenantMiddleware(), permissionMiddleware(["TEACHER_VIEW"]), getTeacherById)
router.put('/:id', authMiddleware, tenantMiddleware(), permissionMiddleware(["TEACHER_UPDATE"]), updateTeacher)
router.delete('/:id', authMiddleware, tenantMiddleware(), permissionMiddleware(["TEACHER_DELETE"]), updateTeacher)

export default router
