const express = require("express");
const config = express();
const bodyParser = require("body-parser")

const morgan = require("morgan")
const _ = require('lodash');
const fileUpload = require('express-fileupload');

config.use(fileUpload({
    createParentPath: true
}));

config.use(express.json());
config.use(bodyParser.json())
config.use(bodyParser.urlencoded({extended : false}))
config.use(morgan('dev'));
config.use(express.static('uploads'));

//CORS
config.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
})


module.exports = config ;
