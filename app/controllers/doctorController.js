
const Doctor = require('../models/doctor');

module.exports.getDoctors = (req, res) => {
    Doctor.find()
        .then(doctors => res.json(doctors))
        .catch(err => res.json(err))
}

module.exports.searchDoctors = (req, res) => {
    const { specialization = null,  location = null } = req.body;
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
    const { id, verify } = req.params;
}