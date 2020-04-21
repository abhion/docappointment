const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const specializationSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const specialization = mongoose.model('specialization', specializationSchema);

module.exports = specialization;