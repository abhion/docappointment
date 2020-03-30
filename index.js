const express = require('express');
const setupDB = require('./config/database');
const app = express();
const port = 3035;
const router = require('./config/routes');

app.use(express.json());
app.use('/', router);


app.listen(port, () => {
    console.log("running on port " + port);
})

setupDB();
