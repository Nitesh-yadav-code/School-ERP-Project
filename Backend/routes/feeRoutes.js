import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMIddleware.js";
import { getFeeReport, getFeesByStudent, payFees } from "../controller/feeCollectionController.js";



const router = express.Router();

// Collect fees
router.post(
  "/pay",
  authMiddleware,
  roleMiddleware(["Admin"]),
  payFees
);

// Student fee history
router.get(
  "/student/:id",
  authMiddleware,
  roleMiddleware(["Admin", "Teacher"]),
  getFeesByStudent
);

// Full report
router.get(
  "/report",
  authMiddleware,
  roleMiddleware(["Admin"]),
  getFeeReport
);

export default router;