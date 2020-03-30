const Specialization = require('../models/specialization');

module.exports = {
    
    createSpecialization: (req, res) => {
        const newSpecialization = new Specialization(req.body);
        newSpecialization.save()
            .then(specialization => res.json(specialization))
            .catch(err => res.json(err))
    }

}