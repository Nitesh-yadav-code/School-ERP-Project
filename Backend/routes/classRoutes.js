
import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createClass, getClass } from '../controller/classController.js';
import { tenantMiddleware } from '../middleware/tenantMiddleware.js';
import { permissionMiddleware } from '../middleware/permissionMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware,tenantMiddleware(), permissionMiddleware(["CLASS_CREATE"]), createClass);
router.get('/', authMiddleware,tenantMiddleware(), permissionMiddleware(["CLASS_VIEW"]), getClass)



export default router;