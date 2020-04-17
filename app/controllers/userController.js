const User = require('../models/user');
const Doctor = require('../models/doctor');


module.exports.createUser = (req, res) => {

    const reqBody = req.body;
    const { name, email, phone, dob, photo, role, password } = reqBody;
    let docObj = {};
    if(reqBody.role !== 'Doctor' && reqBody.role !== 'Patient'){
        res.json({errMessage: 'Invalid user role'});
    }
    if (reqBody.role === 'Doctor') {
        let {
            name, email, phone, dob, photo, role,
            specialization, schoolOfMedicine, fee, documents, location,
            practiseStartDate, practisingAt, daysAvailable, fromTo, appointmentDuration
        } = reqBody;

        docObj = {
            name, email, phone, dob, photo, role, specialization,
            schoolOfMedicine, fee, documents, practiseStartDate, practisingAt,
            location: JSON.parse(location), verficationStatus: 'Pending',
            daysAvailable: JSON.parse(daysAvailable), fromTo: JSON.parse(fromTo), appointmentDuration
        }
    }
    const userObj = new User({ name, email, phone, dob, photo, role, password })
    userObj.save()
        .then(user => {
            if (user.role === "Doctor") {
                const newDoctor = new Doctor(docObj);
                newDoctor.userId = user.id;
                newDoctor.save()
                    .then(doctor => {
                        res.json({ message: 'Registered. You will be able to login once your application is approved' })
                    })
                    .catch(err => res.json(err))
            }
            else {

                res.json({ message: 'Account has been created. Login to continue' });
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
            if (!user) {
                res.json({errMessage: "No user with that email"});
            }
            else {
                if (user.role === 'Doctor') {
                    Doctor.isDoctorVerified(user._id).then()
                        .catch(err => {
                            console.log(err);
                            
                            if (err === false) {
                                res.json({ errMessage: 'Doctor is not verified yet. Cannot login' });
                            }
                            else {
                                res.json(err);
                            }
                        })
                }
                user.verifyCredentials(password)
                    .then(result => {
                        if (result) {
                            user.generateToken()
                                .then(token => {
                                    console.log(token);
                                    res.header("Access-Control-Expose-Headers", 'x-auth');
                                    res.setHeader('x-auth', token)
                                    res.json(
                                        {
                                            user: {
                                                name: user.name,
                                                email: user.email,
                                                phone: user.phone,
                                                photo: user.photo,
                                                role: user.role,
                                                dob: user.dob,
                                                _id: user._id
                                            }, 
                                            message: 'Logging in..'
                                        })
                                })
                                .catch(err => res.json(err));
                        }
                        else {
                            res.json({errMessage: "Invalid email/password"});
                        }
                    })
                    ;
            }
        })
}

module.exports.logout = (req, res) => {
    const user = req.user;
    User.findOneAndUpdate(user._id, { $pull: { tokens: { token: req.header('x-auth') } } }, { new: true })
        .then(user => {
            res.json(user)
        })
        .catch(err => res.json(err));
}

module.exports.listUsers = (req, res) => {
    User.find()
        .then(users => users ? res.json(users) : {})
        .catch(err => res.json(err))
}

module.exports.getLoggedInUser = (req, res) => {

    User.findOne({_id: req.user._id}, { name: 1, email: 1, phone: 1, dob: 1, role: 1, photo: 1 })
        .then(user => user ? res.json(user) : res.json({}))
        .catch(err => res.json(err))
}

module.exports.clearData = (req, res) => {
    Doctor.remove()
        .then(_ => {
            User.remove()
                .then(data => res.json(data));

        })

}