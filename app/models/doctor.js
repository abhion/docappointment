const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema(
    {
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

        fee: {
            type: Number,
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
            type: [String],
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        },

        fromTo: {
            type: {
                from: String,
                to: String
            }
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        appointmentDuration: {
            type: Number,
            required: true
        },

        reviews: [
            new Schema({
                patientId: Schema.Types.ObjectId,
                rating: {
                    enum: [1, 2, 3, 4, 5],
                    type: Number,
                    required: true
                },
                description: {
                    type: String,
                    required: true
                },

                Date: {
                    type: Date,
                    default: Date.now()
                }
            })],

        location: {
            type: {
                type: String,
                enum: ['Point'], // 'location.type' must be 'Point'
                required: true
            },
            coordinates: {
                type: [Number]
            }
        
    }

});

doctorSchema.index({ location: '2dsphere' });


const doctor = mongoose.model('doctor', doctorSchema);

module.exports = doctor;
