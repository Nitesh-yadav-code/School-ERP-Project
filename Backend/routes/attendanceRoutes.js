import express from 'express';
import { roleMiddleware } from '../middleware/roleMIddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getAttendanceByClass, getAttendanceByStudent, markAttendance } from "../controller/attendanceController.js";
import { tenantMiddleware } from '../middleware/tenantMiddleware.js';
import { permissionMiddleware } from '../middleware/permissionMiddleware.js';

const router = express.Router();

router.post("/mark", authMiddleware, tenantMiddleware(),  permissionMiddleware(["ATTENDANCE_MARK"]), markAttendance)

// Get class attendance
router.get("/class", authMiddleware, tenantMiddleware(), permissionMiddleware(["ATTENDANCE_VIEW"]), getAttendanceByClass);

// Get student attendance history
router.get("/student-attendance", authMiddleware,tenantMiddleware(), permissionMiddleware(["ATTENDANCE_VIEW"]), getAttendanceByStudent
);

export default router;