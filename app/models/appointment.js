const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    doctorUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    patientId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    
    date: {
        type: Date,
        required: true
    },
    cancellationDetails: new Schema({
        
            isCancelled: Boolean,
            cancelledBy: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            reason: String
        
    })
});

const appointment = mongoose.model('appointment', appointmentSchema);

module.exports = appointment;