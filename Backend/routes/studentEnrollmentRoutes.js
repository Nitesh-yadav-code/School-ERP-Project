import  exprees  from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantMiddleware } from '../middleware/tenantMiddleware.js';
import { permissionMiddleware } from '../middleware/permissionMiddleware.js';
import { changeSection, enrollStudent, getCurrentEnrollment, getEnrollmentHistory, getEnrollStudents } from '../controller/studentEnrollmentController.js';
import { promotStudents } from '../controller/studentPromotionController.js';

const router = exprees.Router();

router.post('/enroll', authMiddleware, tenantMiddleware(), permissionMiddleware(["STUDENT_ENROLL"]), enrollStudent)
router.get('/get-enrollemnts', authMiddleware, tenantMiddleware(), permissionMiddleware(["STUDENT_VIEW"]), getEnrollStudents)
router.get('/get-current-enrollment', authMiddleware, tenantMiddleware(), permissionMiddleware(["STUDENT_VIEW"]), getCurrentEnrollment)
router.post('/change-section', authMiddleware, tenantMiddleware(), permissionMiddleware(["STUDENT_UPDATE"]), changeSection)
router.get('/enrollmentHistory', authMiddleware, tenantMiddleware(), permissionMiddleware(["STUDENT_VIEW"]), getEnrollmentHistory )

//promotion
router.post('/promot-students', authMiddleware, tenantMiddleware(), permissionMiddleware(["STUDENT_VIEW"]), promotStudents)

export default router