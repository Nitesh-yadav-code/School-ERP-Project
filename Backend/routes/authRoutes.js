import express from "express";
import { getUserDetails, login, updateUser, getUsers, createUser } from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import { permissionMiddleware } from "../middleware/permissionMiddleware.js";

const router = express.Router();



router.post('/user/login', login)
router.post('/user/signup',authMiddleware, createUser)
router.get('/getUsers/:id', authMiddleware, getUserDetails)
router.put('/updateUser/:id', authMiddleware, tenantMiddleware(),permissionMiddleware(["USER_UPDATE"]), updateUser)
router.get('/users', authMiddleware,tenantMiddleware(), permissionMiddleware(["USER_VIEW"]), getUsers);


export default router;