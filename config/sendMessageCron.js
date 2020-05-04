const moment = require('moment');
const Appointment = require('../app/models/appointment');
const today = moment().startOf('day').toISOString();
const todayEnd = moment().endOf('day').toISOString();
const twilio = require('twilio');
const accountSid = 'ACb2cbea51348009e67d47dea3a7928040'; //changed now
const authToken = '65435e187b43c5871a9e6d882c41ea0a';  //changed now
const client = require('twilio')(accountSid, authToken);

const sendMessageToPatients = () => {
    Appointment.find({ "date": { "$gte": today, "$lt": todayEnd } })
        .populate({ path: 'patientId', select: 'name phone' })
        .populate({ path: 'doctorUserId', select: 'name' })
        .then(appointments => {
            appointments.forEach(appointment => {
                const doctor = appointment.doctorUserId.name;
                const patient = appointment.patientId.name;
                const patientPhone = appointment.patientId.phone;
                let time = moment(appointment.date).local().format('hh:mm A');
                const messageBody = `${patient}, you have an appointment with Dr. ${doctor} today at ${time}. If you are unable to visit the doctor for some reason, login to BookADoc and  cancel the appointment.
                `
                client.messages
                    .create({
                        body: messageBody,
                        from: '+12565408443',
                        to: `+91 ${patientPhone}`
                    })
                    .then(message => console.log(message.sid))
                    .catch(err => console.log(err));
            })
        })
        .catch(err => console.log(err));
}

module.exports = sendMessageToPatients;
