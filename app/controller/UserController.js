'use strict';

const User = require('../model/User.js'),
    jwt = require("jsonwebtoken"),
    logger = require('../logger/logger');

exports.list_all_users = (req, res) => {
    User.getAllUsers((err, user) => {
        if (err)
            res.send(err);
        console.log('res', user);
        logger.debug('Response: '+ user);
        res.send(user);
    });
};
  
exports.create_an_user = async (req, res) => {
    var new_user = new User(req.body);

    logger.debug('User ID: '+ new_user.userid);

    //handles null error 
    if((typeof new_user.userid == "undefined" || !new_user.userid) 
    || (typeof new_user.first_name == "undefined" || !new_user.first_name) 
    || (typeof new_user.password == "undefined" || !new_user.password)) {

        return res.status(400).send({ error:true, message: 'Please provide user id, first name and password' });

    } else {

        const user_id_pattern = process.env.USER_ID_PATTERN
        var match_res = await new_user.userid.match(user_id_pattern);
        if (!match_res) {
            // return res.status(400).send({ error:true, message: 'User id must contain 1 number, 1 small letter and 1 capital letter. Length should be 8 to 10 characters.' });
        }

        const password_pattern = process.env.PASSWORD_PATTERN
        match_res = await new_user.password.match(password_pattern);
        if (!match_res) {
            // return res.status(400).send({ error:true, message: 'Password must contain 1 number, 1 small letter, 1 capital letter and 1 special cracters 1 special character [!,@,#,$,%,^,&]. Length should be 8 to 16 characters.' });
        }

        User.checkUserNotExists(new_user)
            .then(val => {
                logger.debug('Response: '+ val);
                User.createUser(new_user, (err, user) => {
                    if (err)
                        return res.send(err)
                    return res.json(user)
                })}, err => {
                    logger.debug('Message: '+ err);  
                    return res.send({'Error': 'Error is creating user','Message': err})
                })
            .catch(err => {
                console.log('Error message:', err);
                return res.send(err)
            });
    }
};

exports.read_an_user = (req, res) => {
    User.getUserById(req.params.id, (err, user) => {
        if (err) {
            logger.debug('Error: '+ err);
            res.send(err);
        }
        res.json(user);
    });
};
  
  
exports.update_an_user = (req, res) => {
    User.updateById(req.params.id, new User(req.body), (err, user) => {
        if (err) {
            logger.debug('Error: '+ err);
            res.send(err);
        }
        res.json(user);
    });
};
  
  
exports.delete_an_user = (req, res) => {  
    User.deleteUser(req.params.id, (err, user) => {
        if (err) {
            logger.debug('Error: '+ err);
            res.send(err);
        }
        res.json({ message: 'User deleted successfully.' });
    });
};

exports.authenticate_an_user = (req, res) => {

    const newUser = new User(req.body);
    logger.info('User id: ' + newUser.userid);

    if (!newUser.userid && !newUser.password) {
        res.status(400).send({ error:true, message: 'Please provide user id and password' });
    } else {
        User.getUserByUserId(newUser, async (err, user) => {
            if (err) {
                logger.debug('Error: '+ err);
                res.json("User ID/Password is not valid");
            }

            var bool = User.comparePassword(newUser.password, user.password);
            
            if (bool) {
                const payload = {
                    userid: user.userid,
                    created: user.created,
                    modified: user.modified
                };
                var token = jwt.sign(payload, process.env.JWT_ENCRYPTION, {
                    expiresIn: process.env.JWT_EXPIRATION
                });
                var decoded = jwt.decode(token);
                
                res.json({
                    success: true,
                    userid: user.userid,
                    signedat: decoded.iat,
                    expiredat: decoded.exp,
                    token: token
                });         
            } else {
                logger.debug('User ID/Password is not valid');
                res.json("User ID/Password is not valid");
            }
        });
    }
};

exports.logout_an_user = (req, res) => { 
    res.status(200).send({
        auth: false, 
        token: null
    });
}