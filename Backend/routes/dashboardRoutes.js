import express from "express";

import { getDashboardStats } from "../controller/dashboardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMIddleware.js";
import { permissionMiddleware } from "../middleware/permissionMiddleware.js";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";

const router = express.Router();

router.get(
  "/stats", authMiddleware, tenantMiddleware(), permissionMiddleware(["ATTENDANCE_VIEW"]), getDashboardStats
);

export default router;
