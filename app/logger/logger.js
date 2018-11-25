'use strict';

const winston = require("winston");

const logger = winston.createLogger({
        format: winston.format.combine(
            winston.format.timestamp (),
            winston.format.printf(info => {
                return `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}` + (info.splat !== undefined ? `${info.splat[0]}` : "");
            })
        ),       
        transports: [
            new winston.transports.Console({level:'info', colorize: true}),
            new winston.transports.File({filename: `${global.__basedir}/nodejs-express-mysql-crud.log`, level: 'debug'})
        ]
    });

module.exports = logger