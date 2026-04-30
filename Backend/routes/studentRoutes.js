import exprees from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMIddleware.js';
import { addStudent, deleteStudent, getStudent, getStudentById, updateStudent } from '../controller/studentController.js';
import { permissionMiddleware } from '../middleware/permissionMiddleware.js';
import { tenantMiddleware } from '../middleware/tenantMiddleware.js';

const router  = exprees.Router();

router.post('/add', authMiddleware,tenantMiddleware(),permissionMiddleware(["STUDENT_CREATE"]), addStudent)

router.get('/getStudents', authMiddleware,tenantMiddleware(), permissionMiddleware(["STUDENT_VIEW"]), getStudent)
router.get('/:id', authMiddleware,tenantMiddleware(),permissionMiddleware(["STUDENT_VIEW"]), getStudentById)
router.put('/:id', authMiddleware,tenantMiddleware(), permissionMiddleware(["STUDENT_UPDATE"]), updateStudent)
router.delete('/:id', authMiddleware,tenantMiddleware(),permissionMiddleware(["STUDENT_DELETE"]), deleteStudent)


export default router;