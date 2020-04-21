
const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');

module.exports.getDoctors = (req, res) => {
    Doctor.find().populate('userId').populate('specialization')
        .then(doctors => res.json(doctors))
        .catch(err => res.json(err))
}


module.exports.getDoctorById = (req, res) => {
    const doctorUserId = req.params.doctorUserId;
    Doctor.find({userId: doctorUserId}).populate('userId')
        .then(doctor => res.json(doctor))
        .catch(err => res.json(err));
}

module.exports.getPendingStatusDoctors = (req, res) => {
    Doctor.find({ verificationStatus: 'Pending' })
        .populate('specialization', 'name')
        .populate('userId', 'name _id photo')
        .then(doctors => doctors ? res.json(doctors) : res.json([]))
        .catch(err => res.json(err));

}

module.exports.searchDoctorsInSubLocality = (req, res) => {
    const { specialization = null, location = null } = req.body;
    console.log(location);
    Doctor.find(
        {
            location: {
                $nearSphere: {
                    $geometry: location,
                    $maxDistance: 4000
                }
            },
            specialization
        },

    ).populate('userId')
        .then(doctors => {
            res.json(doctors);
        })
        .catch(err => res.json(err));
}
module.exports.searchDoctorsInLocality = (req, res) => {
    const { specialization = null, location = null } = req.body;
    console.log(location);
    Doctor.find(
        {
            location: {
                $geoWithin: {
                    $polygon: location.coordinates
                }
            },
            specialization
        },

    ).populate('userId')
        .then(doctors => {
            res.json(doctors);
        })
        .catch(err => res.json(err));
}


module.exports.updateDoctor = (req, res) => {
    const { id } = req.params;
    Doctor.findByIdAndUpdate(id, req.body, { new: true })
        .then(doctor => res.json(doctor))
        .catch(err => res.json(err))
}

module.exports.verifyDoctor = (req, res) => {
    const { id } = req.params;
    const { verificationStatus = 'Pending' } = req.body;
    Doctor.findOneAndUpdate({ userId: id }, {verificationStatus}, { new: true })
        .then(doctor => doctor ? res.json({ message: 'Status Updated', doctor }) : res.json({ errMessage: 'No doctor found' }))
        .catch(err => res.json(err))
}

module.exports.deleteDoctor = (req, res) => {
    const { id } = req.params;
    Doctor.findByIdAndDelete(id)
        .then(doctor => res.json(doctor))
        .catch(err => res.json(err));
}
