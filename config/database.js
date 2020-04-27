const mongoose = require('mongoose');


const setupDB = () => {
    mongoose.connect('mongodb+srv://dbUser:AsimplePasswordMate@cluster0-spmyi.gcp.mongodb.net/test?retryWrites=true&w=majority/book-adoc')
        .then(() => console.log("connected to db"))
        .catch(err => console.log(err))
}

module.exports = setupDB;