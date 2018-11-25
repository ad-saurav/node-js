'use strict';

const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        var myArray = file.originalname.split('.');
        var i = 0;
        var fileNameStr = ""
        myArray.forEach((value) => {
            ++i;
            console.log(value);
            if (i != myArray.length) {
                fileNameStr.concat(value)    
            }        
        });
        console.log(fileNameStr);
        fileNameStr = fileNameStr.concat("-").concat(Date.now()).concat("-").concat(myArray[myArray.length - 1]);
        cb(null, fileNameStr);
    }
});

var upload = multer({storage: storage});

module.exports = upload;