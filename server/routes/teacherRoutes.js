const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { validateTeacher, validateId } = require('../middleware/validation');

router.get('/', teacherController.getTeachers);
router.get('/:id', validateId, teacherController.getTeacherById);
router.post('/', validateTeacher, teacherController.createTeacher);
router.put('/:id', validateId, validateTeacher, teacherController.updateTeacher);
router.delete('/:id', validateId, teacherController.deleteTeacher);

module.exports = router;
