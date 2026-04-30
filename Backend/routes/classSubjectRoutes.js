import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import { permissionMiddleware } from "../middleware/permissionMiddleware.js";
import { createClassSubject, getClassSubjects } from "../controller/classSubjectController.js";
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["CLASS_SUBJECT_CREATE"]),
  createClassSubject
);

router.get(
  "/",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["CLASS_SUBJECT_VIEW"]),
  getClassSubjects
);

export default router;