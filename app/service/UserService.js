'user strict';

const logger = require('../logger/logger'),
    jwt = require("jsonwebtoken"),
    UserRepository = require("../repository/UserRepository"),
    User = require('../model/User');

exports.getAllUsers = (result) => {
    return UserRepository.getAllUsers(result);
};

exports.createUser = (newUser, result) => {  
    return UserRepository.createUser(newUser, result);
};

exports.getUserById = (id, result) => {
    return UserRepository.getUserById(id, result);
};

exports.authenticateAnUser = (newUser, result) => {

    if (!newUser.userid && !newUser.password) {
        res.status(400).send({ error:true, message: 'Please provide user id and password' });
    } else {
        UserRepository.getUserByUserId(newUser, (err, user) => {
            if (err) {
                logger.debug('Error: ' + err);
                result("1. User ID/Password is not valid", null);
            }

            var bool = UserRepository.comparePassword(newUser.password, user.password);

            if (bool) {
                logger.debug("Password Compare: " + bool)
                const payload = {
                    userid: user.userid,
                    created: user.created,
                    modified: user.modified
                };
                var token = jwt.sign(payload, process.env.JWT_ENCRYPTION, {
                    expiresIn: process.env.JWT_EXPIRATION
                });
                var decoded = jwt.decode(token);

                result(null, {
                    success: true,
                    userid: user.userid,
                    signedat: decoded.iat,
                    expiredat: decoded.exp,
                    token: token
                }); 
            } else {
                logger.debug('2. User ID/Password is not valid');
                result("2. User ID/Password is not valid", null);
            }
        });
    }
};

exports.checkUserNotExists = (user) => {
    return UserRepository.checkUserNotExists(user.userid);
};

exports.updateById = (id, user, result) => {
    return UserRepository.updateById(id, user, result);
};

exports.deleteUser = (id, result) => {
    return UserRepository.deleteUser(id, result);
};