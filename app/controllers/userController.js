const User = require('../models/user');
const Doctor = require('../models/doctor');

module.exports.createUser = (req, res) => {
        
        const { doctor = null, ...user } = req.body;
        console.log(doctor, "THE DOCTOR");
        console.log(user, "THE USER");
        const userObj = new User(user);
        userObj.save()
            .then(user => {
                if(user.role === "Doctor"){
                    const newDoctor = new Doctor(doctor);
                    newDoctor.userId = user.id;
                    newDoctor.save()
                        .then(doctor => {
                            res.json({...user, ...doctor})
                        })
                }
                else{

                    res.json(user);
                }
            })
            .catch(err => res.json(err));
}

module.exports.listUsers = (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.json(err))
}

module.exports.clearData = (req, res) => {
    Doctor.remove()
    .then(_ => {
        User.remove()
            .then(data => res.json(data));

    })

}