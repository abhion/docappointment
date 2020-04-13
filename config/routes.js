const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/userController');
const specializationController = require('../app/controllers/specializationController');
const doctorController = require('../app/controllers/doctorController');
const appointmentController = require('../app/controllers/appointmentController');
const reviewsController = require('../app/controllers/reviewsController');


const authenticate = require('../app/middlewares/authenticate');
const multer = require('multer');
const makeDir = require('make-dir');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        makeDir('./userfiles/rama@gmail.com')
            .then(made => {
                console.log(" ======== ", made, " ======== ");
                cb(null, made);

            })
            .catch(err => console.log(err))
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
})

const upload = multer({storage});

router.post('/user', upload.fields([{name: 'profilePic', maxCount: 1}, {name: 'docs', maxCount: 3}]), userController.createUser);
router.get('/users', userController.listUsers);
router.delete('/users', userController.clearData);
router.post('/login', userController.login);
router.delete('/logout', userController.logout);

router.post('/specialization', specializationController.createSpecialization);
router.get('/specializations', specializationController.listSpecializations);


router.get('/doctors',  doctorController.getDoctors);
router.post('/search',  doctorController.searchDoctors);
router.put('/doctor/:id',  doctorController.updateDoctor);
router.put('/doctor/:id/:verify', authenticate.authenticateUser, authenticate.isAdmin, doctorController.verifyDoctor);
router.delete('/doctor/:id', authenticate.authenticateUser, authenticate.isAdmin, doctorController.deleteDoctor);

router.post('/appointment', authenticate.authenticateUser, authenticate.isPatient, appointmentController.bookAppointment);
router.get('/appointments/:userId', authenticate.authenticateUser, appointmentController.getAppointments);
router.get('/appointment/:id', authenticate.authenticateUser, appointmentController.getAppointmentById);
router.put('/appointment/:id/:cancel', authenticate.authenticateUser, appointmentController.cancelAppointment);
router.delete('/appointments', appointmentController.deleteAllAppointments);


router.post('/review', reviewsController.addReview);
router.put('/review/:doctorUserId', reviewsController.updateReview);
router.get('/reviews/:doctorUserId', reviewsController.getDoctorReviews);


module.exports = router;