const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const privateKey = fs.readFileSync(path.resolve(__dirname + '/../security/private.pem'));
const User = require('../models/user');

const authenticateUser = (req, res, next) => {
    const token = req.header('x-auth');
    if (!token) {
        res.json({error:'Invalid token'});
    }
    try {
        const tokenData = jwt.verify(token, privateKey);
        User.findOne({_id: tokenData._id, 'tokens.token': token})
            .then(user => {
                if(user){
                    req.user = user;
                    next();
                }
                else{
                    res.json({error:'Invalid token'});
                }
            })
        
    } catch (error) {
        res.status(401).json(error);
    }

}

const isAdmin = (req, res, next) => {
    const user = req.user;
    if(user.role === 'Admin'){
        next();
    }
    else{
        console.log("not an admin", user.role)
        res.status(401).send('Not authorized to do this action');
    }
}

const isPatient = (req, res, next) => {
    const user = req.user;
    if(user.role === 'Patient'){
        next();
    }
    else{
        res.status(401).send('Not authorized to do this action');
    }
}
const isDoctor = (req, res, next) => {
    const user = req.user;
    if(user.role === 'Doctor'){
        next();
    }
    else{
        res.status(401).send('Not authorized to do this action');
    }
}


module.exports = {authenticateUser, isAdmin, isPatient, isDoctor};