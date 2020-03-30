
const Doctor = require('../models/doctor');

module.exports.getDoctors = (req, res) => {
    Doctor.find()
        .then(doctors => res.json(doctors))
        .catch(err => res.json(err))
}
