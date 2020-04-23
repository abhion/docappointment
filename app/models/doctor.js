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

        verificationStatus: {
            type: String,
            default: 'Pending'
        },

        appointmentDuration: {
            type: Number,
            required: true
        },

        reviews: [
            new Schema({
                patientId: {
                    type: Schema.Types.ObjectId,
                    ref: 'user'
                },
                rating: {
                    enum: [1, 1.5, 2, 2.5, 3.5, 3, 4.5, 4, 5],
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

    },{toJSON: {getters: true}, toObject: {getters: true}});
    doctorSchema.virtual('avgRating').get(function () {
        console.log("AV", this.reviews, "EAV");
        if(this.reviews){
            let avgRating = 0;
            avgRating = this.reviews.reduce((acc, review) => {
                return review.rating + acc;
            }, 0);
            avgRating = avgRating / this.reviews.length || 0;
            return {avgRating, numberOfReviews:this.reviews.length};
        }
        else{
            return null;
        }
    })
doctorSchema.set('toObject', {getters: true});
doctorSchema.set('toJSON', {getters: true});

doctorSchema.index({ location: '2dsphere' });

doctorSchema.statics.isDoctorVerified = function (userId) {
    const Doctor = this;
    return Doctor.findOne({ userId }, { verificationStatus: 1 })
        .then(status => {
            console.log(status, "DOCSTATUS");

            if (status.verificationStatus === 'Verified') {
                return Promise.resolve(true);
            }
            return Promise.reject(false);
        })
        .catch(err => Promise.reject(err))
}


const doctor = mongoose.model('doctor', doctorSchema);

module.exports = doctor;
