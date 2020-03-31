
const Doctor = require('../models/doctor');

module.exports.getDoctors = (req, res) => {
    Doctor.find()
        .then(doctors => res.json(doctors))
        .catch(err => res.json(err))
}

module.exports.searchDoctors = (req, res) => {
    const { specialization,  location, searchTerm } = req.body;
    console.log(req.body);
    Doctor.find(
        {
          location: {
             $nearSphere: {
                $geometry: location,
                $maxDistance: 10000
             }
          }
        }
     )
     .then(doctors => {
         res.json(doctors);
     })
}