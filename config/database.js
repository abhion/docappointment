const mongoose = require('mongoose');


const setupDB = () => {
    mongoose.connect('mongodb+srv://dbUser:WinkLab@69@cluster0-spmyi.gcp.mongodb.net/test?retryWrites=true&w=majority')
        .then(() => console.log("connected to db"))
        .catch(err => console.log(err))
}

module.exports = setupDB;