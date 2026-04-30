import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantMiddleware } from '../middleware/tenantMiddleware.js';
import { permissionMiddleware } from '../middleware/permissionMiddleware.js';
import { getClassMonthlyAttendance, getStudentMonthlyAttendance } from '../controller/attendanceReportController.js';

const router = express.Router();
router.get('/student', authMiddleware, tenantMiddleware(), permissionMiddleware(["ATTENDANCE_VIEW"]), getStudentMonthlyAttendance)
router.get('/class', authMiddleware, tenantMiddleware(), permissionMiddleware(["ATTENDANCE_VIEW"]), getClassMonthlyAttendance)
export default router;