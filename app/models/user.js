const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { emailValidator } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        validate: {
            validator: function validator(value) {
                return emailValidator.isEmail(value);
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
        type: String
    },

    role: {
        enum: ["Admin", "Doctor", "Patient"],
        required: true
    }

});

userSchema.pre('save', function(next){
    const user = this;
    bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(this.password, salt)
                .then(hashedPass => {
                    this.password = hashedPass;
                })
        })
    next();
})

const user = mongoose.model('user', userSchema);

module.exports = user;