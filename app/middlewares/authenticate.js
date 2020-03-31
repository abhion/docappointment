const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const privateKey = fs.readFileSync(path.resolve(__dirname + '../security/private.pem'));

const authenticateUser = (req, res, next) => {
    const token = req.header('x-auth');
    if (!header) {
        res.status(401).send('Invalid token');
    }
    try {
        const tokenData = jwt.verify(token, privateKey);
        req.user = tokenData;
    } catch (error) {
        res.json(err);
    }
    


    next();
}