const Specialization = require('../models/specialization');

module.exports = {
    
    createSpecialization: (req, res) => {
        const newSpecialization = new Specialization(req.body);
        newSpecialization.save()
            .then(specialization => res.json({message: 'Added new speciality'}))
            .catch(err => res.json(err))
    },

    listSpecializations: (req, res) => {
        Specialization.find()
            .then(specializations => res.json(specializations))
            .catch(err => res.json(err))
    }

}