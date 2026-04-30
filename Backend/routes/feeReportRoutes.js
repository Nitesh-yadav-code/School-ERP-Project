import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import { permissionMiddleware } from "../middleware/permissionMiddleware.js";

import {
  getStudentFeeSummary,
  getFeeDefaulters,
} from "../controller/feeReportController.js";

const router = express.Router();

/**
 * Student fee summary
 */
router.get(
  "/student/:studentEnrollmentId",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["FEE_VIEW"]),
  getStudentFeeSummary
);

/**
 * Fee defaulters report
 */
router.get(
  "/defaulters",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["FEE_DEFAULTER_VIEW"]),
  getFeeDefaulters
);

export default router;
