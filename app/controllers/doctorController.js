
const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.PASS
    }
});

console.log("====================", process.env.GMAIL_USERNAME, "===========---------=========");
console.log("====================", process.env.PASS, "=-------------------");

module.exports.getDoctors = (req, res) => {
    Doctor.find().populate('userId').populate('specialization')
        .then(doctors => res.json(doctors))
        .catch(err => res.json(err))
}


module.exports.getDoctorById = (req, res) => {
    const doctorUserId = req.params.doctorUserId;
    Doctor.find({ userId: doctorUserId }).populate('userId')
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
                    $geometry: {
                        type: "Polygon",
                        coordinates: [location.coordinates]
                    }
                }

            },
            specialization
        }

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
    Doctor.findOneAndUpdate({ userId: id }, { verificationStatus }, { new: true }).populate({ path: 'userId', select: 'email' })
    .then(doctor => {
        // console.log(doctor);
        // console.log(doctor, " THS");
        
        const doctorEmail = doctor.userId.email;
            const message = verificationStatus === 'Verified' ? `<div>
            Hi,
            We have reviewed the details you submitted and are pleased to inform that you can now start using BookADoc. You will now appear in
            search results of our application. You can now login and look at appointments and feedback submitted by your patients.
        </div>` :
                `<div>
                    Hi,
                    We have reviewed the details you submitted and are sorry to inform that your application has been denied.
                 </div>`
            const mailOptions = {
                from: process.env.GMAIL_USERNAME,
                to: doctorEmail,
                subject: verificationStatus === 'Verified' ? 'BookADoc - Verified' : 'BookADoc - Rejected',
                html: message
            }
            // console.log(mailOptions);
            transporter.sendMail(mailOptions, function (err, info) {
                console.log(err, info);
            })
            doctor ? res.json({ message: 'Status Updated', doctor }) : res.json({ errMessage: 'No doctor found' })
        })
        .catch(err => res.json(err))
}

module.exports.deleteDoctor = (req, res) => {
    const { id } = req.params;
    Doctor.findByIdAndDelete(id)
        .then(doctor => res.json(doctor))
        .catch(err => res.json(err));
}
