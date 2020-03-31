const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/userController');
const specializationController = require('../app/controllers/specializationController');
const doctorController = require('../app/controllers/doctorController');

router.post('/user', userController.createUser);
router.get('/users', userController.listUsers);
router.delete('/users', userController.clearData);

router.post('/specialization', specializationController.createSpecialization);

router.get('/doctors', doctorController.getDoctors);

router.post('/search', doctorController.searchDoctors)

module.exports = router;