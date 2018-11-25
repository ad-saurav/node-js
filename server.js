'use strict';

const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    dotenv = require('dotenv').config({ path: process.env.USERPROFILE + "/nodejs-express-mysql-crud.env" }),
    cors = require('cors'),
    corsOptions = {
        origin: 'http://localhost:4200',
        optionsSuccessStatus: 200
    };
    
global.__basedir = __dirname;

if (dotenv.error) {
    throw dotenv.error
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const upload = require('./app/config/multer.config.js');
const routes = require('./app/routes/routes'); //importing route
routes(app, upload); //register the route

module.exports = app

// This is here to handle all the uncaught rejections
process.on('unhandledRejection', error => {
    console.error('Uncaught Error', error);
});