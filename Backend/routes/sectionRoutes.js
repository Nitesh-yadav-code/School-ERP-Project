import express from 'express'
import { createSection, getSectionsByClass } from '../controller/sectionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantMiddleware } from '../middleware/tenantMiddleware.js';
import { permissionMiddleware } from '../middleware/permissionMiddleware.js';

const router = express.Router();

router.post("/", authMiddleware,tenantMiddleware(),permissionMiddleware(["SECTION_CREATE"]), createSection)
router.get("/", authMiddleware,tenantMiddleware(), permissionMiddleware(["SECTION_VIEW"]), getSectionsByClass)

export default router;