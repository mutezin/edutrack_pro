const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { validateStudent, validateId } = require('../middleware/validation');

router.get('/', studentController.getStudents);
router.get('/:id', validateId, studentController.getStudentById);
router.post('/', validateStudent, studentController.createStudent);
router.put('/:id', validateId, validateStudent, studentController.updateStudent);
router.delete('/:id', validateId, studentController.deleteStudent);

module.exports = router;
