import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import { permissionMiddleware } from "../middleware/permissionMiddleware.js";

import {
  createSubject,
  getAllSubjects,
} from "../controller/subjectController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["SUBJECT_CREATE"]),
  createSubject
);

router.get(
  "/",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["SUBJECT_VIEW"]),
  getAllSubjects
);

export default router;
