const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    specialization: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'specialization'
    },

    schoolOfMedicine: {
        type: String,
        required: true
    },

    documents: {
        type: [String]
    },
    practiseStartDate: {
        type: Date,
        required: true
    },

    practisingAt: {
        type: String,
        required: true
    },

    daysAvailable: {
        enum: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday", "Sunday"],
        required: true
    },

    fromTo: {
        type: {
            from: String,
            to: String
        }
    },

    isVerified: {
        type: Boolean
    },

    appointmentDuration: {
        type: Number,
        required: true
    },

    reviews: [new Schema({
        patientId: Schema.Types.ObjectId,
        rating: {
            enum: [1, 2, 3, 4, 5],
            type: Number,
            required: true
        },
        doctorId: Schema.Types.ObjectId,
        Date: {
            type: Date,
            default: Date.now()
        }
    })]
    ,

    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }

});

doctorSchema.index({ location: '2dsphere' });

const doctor = mongoose.model('doctor', doctorSchema);

module.exports = doctor;
