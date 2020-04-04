const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const emailValidator = require('validator/lib/isEmail');
const bcryptjs = require('bcryptjs');
const signJwt = require('jsonwebtoken/sign');
const fs = require('fs');
const path = require('path');

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
            message: function () {
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
    },
    tokens: {
        type: [
            {
                token: {
                    type: String
                },
                createdAt: {
                    type: Date,
                    default: Date.now()
                }
            }
        ]
    }

});

userSchema.methods.generateToken = function () {
    const user = this;
    const tokenData = {
        _id: user._id,
        username: user.email,
        createdAt: Date.now()
    }
    const token = signJwt(tokenData, fs.readFileSync(path.resolve(__dirname, '../security/private.pem'), 'utf-8'));
    if (token) {
        user.tokens.push({ token });
        return user.save()
            .then(savedUser => {
                return Promise.resolve(token);
            })


    } else {
        return Promise.reject('Error generating token');
    }


}

userSchema.methods.verifyCredentials = function (password) {
    const user = this;
    return bcryptjs.compare(password, user.password)
        .then(result => Promise.resolve(result))

}

userSchema.pre('save', function (next) {
    const user = this;
    if (user.isNew) {
        bcryptjs.genSalt(10)
            .then(salt => {
                bcryptjs.hash(this.password, salt)
                    .then(hashedPass => {
                        user.password = hashedPass;
                        next();
                    })
            })

    }
    else{
        next();
    }

})

const user = mongoose.model('user', userSchema);

module.exports = user;