import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import { permissionMiddleware } from "../middleware/permissionMiddleware.js";
import { createFeeStructure, deleteFeeStructure, getFeeStructures, updateFeeStructure } from "../controller/feeStructureController.js";


const router = express.Router();
router.post('/', authMiddleware, tenantMiddleware(), permissionMiddleware(["FEE_STRUCTURE_CREATE"]), createFeeStructure);
router.get('/', authMiddleware, tenantMiddleware(), permissionMiddleware(["FEE_STRUCTURE_VIEW"]), getFeeStructures);
router.put('/:id', authMiddleware, tenantMiddleware(), permissionMiddleware(["FEE_STRUCTURE_UPDATE"]), updateFeeStructure);
router.delete('/:id', authMiddleware, tenantMiddleware(), permissionMiddleware(["FEE_STRUCTURE_DELETE"]), deleteFeeStructure);

export default router;