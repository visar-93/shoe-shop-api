const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const main = async () => {
    const app = express();

    // app.use(bodyParser.urlencoded()); // x-wwww-form-urlencoded <form>
    app.use(bodyParser.json()); // application-json
    app.use('/images', express.static(path.join(__dirname, 'images')));
    
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin','*'); // * - set to all url and domains
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
    
    app.use('/api/feed', feedRoutes);
    
    app.use((error, req, res, next) => {
        console.log(error);
        const status = error.statusCode || 500;
        const message = error.message;
        res.status(status).json({message: message});
    });

    await mongoose.connect('mongodb+srv://visardb:E7Pzdq6rz8cMCgU8@cluster1.epldc.mongodb.net/project1?retryWrites=true&w=majority')
    app.listen(8080);
}

main().catch((err) => console.error(err))
