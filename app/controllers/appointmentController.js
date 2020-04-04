const Appointment = require('../models/appointment');


module.exports.bookAppointment = (req, res) => {
    const { appointmentDate, doctorUserId } = req.body;
    Appointment.findOne({ doctorUserId, date: appointmentDate })
        .then(appointment => {
            if (appointment) {
                res.json('The doctor is not available at this time');
            }
            else {
                const newAppointment = new Appointment(req.body);
                newAppointment.save()
                    .then(appointment => res.json(appointment))
                    .catch(err => res.json(err))
            }
        })
        .catch(err => res.json(err))
}

module.exports.cancelAppointment = (req, res) => {
    const { id } = req.params;
    const { cancellationDetails } = req.body;
    Appointment.findOneAndUpdate(id, cancellationDetails,  { new: true })
    .then(appointment => appointment ? res.json(appointment) : res.json({}))
    .catch(err => res.json(err))

}

module.exports.getAppointments = (req, res) => {
    const userId = req.body.userId;
    Appointment.find( { $or: [{ patientId: userId }, { doctorUserId: userId }] } )
        .populate('doctorUserId')
        .populate('patientId')
        .then(appointments => appointments.length ? res.json(appointments): res.json([]))
        .catch(err => res.json(err))
}

module.exports.getAppointmentById = (req, res) => {
    const { id } = req.params;
    Appointment.findById(id)
        .then(appointment => res.json(appointment))
        .catch(err => res.json(err))
}