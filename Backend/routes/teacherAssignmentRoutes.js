import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import { permissionMiddleware } from "../middleware/permissionMiddleware.js";

import {
  assignTeacher,
  getTeacherAssignments,
} from "../controller/teacherAssignmentController.js";

const router = express.Router();


router.post(
  "/",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["TEACHER_ASSIGN"]),
  assignTeacher
);


router.get(
  "/",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["TEACHER_ASSIGN_VIEW"]),
  getTeacherAssignments
);

export default router;
