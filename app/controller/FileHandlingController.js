'use strict';

const uploadFolder = __basedir + '/uploads/',
    fs = require('fs'),
    logger = require('../logger/logger');

exports.upload_a_file = async (req, res, next) => {
    try {

        logger.debug('Upload request body: ' +  req);
        const file = req.file

        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
        res.send(file)
        res.send(file)
    } catch (err) {
        res.sendStatus(400);
    }
}; 
  
exports.download_a_file = async (req, res) => {  
    try {
        var filename = req.params.filename;
        logger.debug('Filename: ' +  filename);
        res.download(uploadFolder + filename); 
    } catch(err) {
        res.sendStatus(400);
    }
};

exports.list_all_files = (req, res) => { 
    try {
        fs.readdir(uploadFolder, (err, files) => {
            logger.debug('File list: ' +  files);
            res.send(files);
        });
    } catch(err) {
        res.sendStatus(400);
    }
};