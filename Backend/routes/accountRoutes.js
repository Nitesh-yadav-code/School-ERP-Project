import { authMiddleware } from "../middleware/authMiddleware.js";
import express from 'express';
import { createAccountWithAdmin, getAccounts } from "../controller/accountController.js";
import { permissionMiddleware } from "../middleware/permissionMiddleware.js";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";

const router = express.Router();
router.post('/', authMiddleware, permissionMiddleware(["ACCOUNT_CREATE"]), createAccountWithAdmin  )
router.get('/get-accounts', authMiddleware, permissionMiddleware(["ACCOUNT_VIEW"]), getAccounts)

export default router;