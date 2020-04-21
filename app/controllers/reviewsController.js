const Doctor = require('../models/doctor');

module.exports.addReview = (req, res) => {
    const { doctorUserId, patientId = null, rating = null, description = null } = req.body;
    Doctor.findOne({userId: doctorUserId})
        .then(doctor => {
            if (doctor) {
                doctor.reviews.push({ patientId, rating, description })
                doctor.save()
                    .then(doctor => res.json({reviews: doctor.reviews, message: 'Submitted feedback'}))
                    .catch(err => res.json(err))
            }
            else {
                res.status(404).send('No doctor found');
            }
        })
}

module.exports.updateReview = (req, res) => {
    const { doctorUserId } = req.params;
    const { patientId = null, rating = null, description = null } = req.body;
    Doctor.updateOne(
        { userId: doctorUserId, "reviews.patientId": patientId },
        {$set: {"reviews.$": { patientId, rating, description }}}
    )
    .then(doctor => res.json(doctor.reviews))
    .catch(err => res.json(err));
}

module.exports.getDoctorReviews = (req, res) => {
    const { doctorUserId } = req.params;
    Doctor.findOne({userId: doctorUserId}, { reviews: 1 })
    .populate({path: 'reviews.patientId', select: {name: 1}})
        .then(reviews => res.json(reviews))
        .catch(err => res.json(err))
}