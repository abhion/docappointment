const Appointment = require('../models/appointment');


module.exports.bookAppointment = (req, res) => {
    const { date, doctorUserId } = req.body;
    Appointment.findOne({ doctorUserId, date: new Date(date), 'cancellationDetails.isCancelled': false })
        .then(appointment => {
            if (appointment && (!appointment.cancellationDetails.isCancelled)) {
                res.json('The doctor is not available at this time');
            }
            else {
                const newAppointment = new Appointment(req.body);
                newAppointment.save()
                    .then(appointment => {
                       appointment ? res.json({message: 'Booked Appointment', appointment}) : res.json()
                    })
                    .catch(err => res.json(err))

            }
        })
        .catch(err => {
            res.json(err)

        })
}

module.exports.cancelAppointment = (req, res) => {
    const { id } = req.params;
    const cancellationDetails = req.body;
    Appointment.findByIdAndUpdate(id, { cancellationDetails }, { new: true })
        .then(appointment => appointment ? res.json({appointment, message: 'Cancelled'}) : res.json('No appointment found'))
        .catch(err => res.json(err))

}

module.exports.getAppointments = (req, res) => {
    const userId = req.params.userId;
    Appointment.find({ $or: [{ patientId: userId }, { doctorUserId: userId }] })
        .populate('doctorUserId')
        .populate('patientId')
        .then(appointments => appointments.length ? res.json(appointments) : res.json([]))
        .catch(err => res.json(err))
}


module.exports.getUpcomingAppointments = (req, res) => {
    const doctorUserId = req.params.doctorUserId;
    const today = new Date();
    today.setHours(0)
    today.setMinutes(0)
    Appointment.find({ doctorUserId,  "date": { "$gte": today }})
        .then(appointments => res.json(appointments))
        .catch(err => console.log(err))
}

module.exports.getAppointmentById = (req, res) => {
    const { id } = req.params;
    Appointment.findById(id)
        .then(appointment => appointment ? res.json(appointment) : res.json('No appointment found'))
        .catch(err => res.json(err))
}

module.exports.deleteAllAppointments = (req, res) => {
    Appointment.remove()
        .then(appointments => res.json(appointments))
}