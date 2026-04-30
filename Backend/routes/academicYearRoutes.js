import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import { permissionMiddleware } from "../middleware/permissionMiddleware.js";

import {
  createAcademicYear,
  getAcademicYears,
  getCurrentAcademicYear,
  closeAcademicYear,
} from "../controller/academicYearController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["ACADEMIC_YEAR_CREATE"]),
  createAcademicYear
);

router.get(
  "/",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["ACADEMIC_YEAR_VIEW"]),
  getAcademicYears
);

router.get(
  "/current",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["ACADEMIC_YEAR_VIEW"]),
  getCurrentAcademicYear
);

router.put(
  "/:academicYearId/close",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["ACADEMIC_YEAR_CLOSE"]),
  closeAcademicYear
);

export default router;
