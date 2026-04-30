import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import { permissionMiddleware } from "../middleware/permissionMiddleware.js";

import {
  makeFeePayment,
  getFeePaymentsByAssignment,
} from "../controller/feePaymentController.js";

const router = express.Router();

/**
 * Make a fee payment
 */
router.post(
  "/pay",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["FEE_PAY"]),
  makeFeePayment
);

/**
 * Get payment history of a fee assignment
 */
router.get(
  "/assignment/:feeAssignmentId",
  authMiddleware,
  tenantMiddleware(),
  permissionMiddleware(["FEE_VIEW"]),
  getFeePaymentsByAssignment
);

export default router;
