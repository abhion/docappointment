const mongoose = require('mongoose');


const setupDB = () => {
    mongoose.connect('mongodb+srv://dbUser:pass@cluster0-spmyi.gcp.mongodb.net/test?retryWrites=true/book-adoc') //changed now 
    
    // mongoose.connect('mongodb://localhost:27017/book-a-doc')
        .then(() => console.log("connected to db"))
        .catch(err => console.log(err))
}

module.exports = setupDB; 
//mongodb+srv://dbUser:AsimplePasswordMate@cluster0-spmyi.gcp.mongodb.net/test?retryWrites=true/book-adoc
