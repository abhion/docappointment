const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cancellationSchema =  new Schema({

    isCancelled: {
        type: Boolean,
        default: false,
        required: true
    },
    cancelledBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    reason: {
        type: String,
        default: '',
        required: true
    }

});

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
    cancellationDetails: {
        type: cancellationSchema,
        required: true,
        default: {
            isCancelled: false,
            reason: 'none'
        }
    }
});

const appointment = mongoose.model('appointment', appointmentSchema);

module.exports = appointment;