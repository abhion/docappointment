const User = require('../models/user');
const Doctor = require('../models/doctor');


module.exports.createUser = (req, res) => {
        
        const { doctor = null, ...user } = req.body;
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

module.exports.bulkUploadDoctors = (req, res) => {

}

module.exports.login = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if(!user){
                res.json("No user with that email");
            }
           else{
            user.verifyCredentials(password)
                .then(result => {
                    if(result){
                        user.generateToken()
                            .then(token => {
                                res.setHeader('x-auth', token).send({})
                            })
                            .catch(err => res.json(err));
                    }
                    else{
                        res.json("Invalid password");
                    }
                })
            ;
           }
        })
}

module.exports.logout = (req, res) => {
    const user = req.user;
    User.findOneAndUpdate( user._id, { $pull: { tokens: {token : req.header('x-auth')} } }, {new: true} )
        .then(user => {
            res.json(user)
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