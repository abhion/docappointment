;
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const moment = require('moment');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.PASS
    }
});
const Doctor = require('../app/models/doctor');
const Appointment = require('../app/models/appointment');

createHtml = (tableRows) => {
    const html = `
        <h3>Today's appointment schedule</h3>
        <table >
            <thead>
                <th>Sno</th>
                <th>Patient name</th>
                <th>Phone</th>
                <th>Time</th>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;
    return html;
}

module.exports = sendMailThroughCron = () => {
    console.log("=================================CRON===============================================================");
    Doctor.find().populate({path: 'userId', select: 'email'}).then(doctors => {
        const today = moment().startOf('day').toISOString();
        const todayEnd = moment().endOf('day').toISOString();
        const htmlPromises = doctors.map(doctor => {
            return Appointment.find({ doctorUserId: doctor.userId,  "date": { "$gte": today, "$lt":todayEnd }})
            .populate({ path: 'patientId', select: 'name phone date' })
                .then(appointments => {
                    const tableRows = appointments.map((appointment, i) => {
    
                        return `<tr>
                            <td>${i + 1}</td>
                            <td>${appointment.patientId.name}</td>
                            <td>${appointment.patientId.phone}</td>
                            <td>${(moment(appointment.date).local().format('ddd DD MMM YYYY hh:mm A'))}</td>
                        </tr>`
                    });
                    if(tableRows.length){
                        const mailHtml = createHtml(tableRows);
                        const mailOptions = {
                            from: process.env.GMAIL_USERNAME,
                            to: doctor.userId.email,
                            subject: 'BookADoc - Today\'s appointments',
                            html: mailHtml
                        }
                        return mailOptions;
                    }
                    else return ;
                    
                })
                .catch(err => console.log(err));
        })
        Promise.all(htmlPromises)
            .then(mailOptions => {
                mailOptions.forEach(mailOptionsObj => {
                    transporter.sendMail(mailOptionsObj, function (err, info) {
                        console.log(err, info);
                    })
                })
                res.json(results.filter(result => result))
            })
            .catch(err => console.log(err))
    })

}
