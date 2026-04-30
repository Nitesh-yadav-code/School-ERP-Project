import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMIddleware.js';
import { createFeeSetup, getFeeByClass } from '../controller/feeSetupController.js';

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware(["Admin"]), createFeeSetup);
router.get("/:classId", authMiddleware, roleMiddleware(["Admin"]), getFeeByClass);

export default router;