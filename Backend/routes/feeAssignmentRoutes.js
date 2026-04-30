import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import { permissionMiddleware } from "../middleware/permissionMiddleware.js";

import {
  assignFeesToEnrollment,
  getFeeAssignmentsByEnrollment,
  updateFeeAssignment,
  deleteFeeAssignment,
} from "../controller/feeAssignmentController.js";

const router = express.Router();

/**
 * Assign fees to student enrollment
 */
router.post(
  "/assign",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["FEE_ASSIGN"]),
  assignFeesToEnrollment
);

/**
 * Get fee assignments by enrollment
 */
router.get(
  "/enrollment/:studentEnrollmentId",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["FEE_VIEW"]),
  getFeeAssignmentsByEnrollment
);

/**
 * Update fee assignment
 */
router.put(
  "/:id",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["FEE_ASSIGN_UPDATE"]),
  updateFeeAssignment
);

/**
 * Delete fee assignment
 */
router.delete(
  "/:id",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["FEE_ASSIGN_DELETE"]),
  deleteFeeAssignment
);

export default router;
