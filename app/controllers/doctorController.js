
const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');

module.exports.getDoctors = (req, res) => {
    Doctor.find()
        .then(doctors => res.json(doctors))
        .catch(err => res.json(err))
}

module.exports.searchDoctors = (req, res) => {
    const { specialization = null, location = null } = req.body;
    Doctor.find(
        {
            location: {
                $nearSphere: {
                    $geometry: location,
                    $maxDistance: 10000
                }
            },
            specialization
        },

    )
        .then(doctors => {
            res.json(doctors);
        })
        .catch(err => res.json(err));
}

module.exports.updateDoctor = (req, res) => {
    const {id} = req.params;
    Doctor.findByIdAndUpdate(id, req.body, {new: true})
        .then(doctor => res.json(doctor))
        .catch(err => res.json(err))
}

module.exports.verifyDoctor = (req, res) => {
    const { id } = req.params;
    Doctor.findOneAndUpdate({userId: id}, req.body, {new: true})
        .then(doctor => res.json(doctor))
        .catch(err => res.json(err))
}

module.exports.deleteDoctor = (req, res) => {
    const { id } = req.params;
    Doctor.findByIdAndDelete(id)
        .then(doctor => res.json(doctor))
        .catch(err => res.json(err));
}
