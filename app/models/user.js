const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const emailValidator = require('validator/lib/isEmail');
const bcryptjs = require('bcryptjs');

const userSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function validator(value) {
                return emailValidator(value);
            },
            message: function(){
                return "Invalid Email";
            }
        }
    },

    phone: {
        type: Number,
        minlength: 10,
        maxlength: 10,
        required: true
    },

    dob: {
        type: Date,
        required: true
    },

    photo: {
        type: String
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["Admin", "Doctor", "Patient"]
    }

});

userSchema.pre('save', function(next){
    const user = this;
    bcryptjs.genSalt(10)
        .then(salt => {
            bcryptjs.hash(this.password, salt)
                .then(hashedPass => {
                    this.password = hashedPass;
                })
        })
    next();
})

const user = mongoose.model('user', userSchema);

module.exports = user;