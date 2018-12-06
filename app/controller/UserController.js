'use strict';

const UserService = require('../service/UserService'),
    logger = require('../logger/logger'),
    User = require('../model/User');

exports.list_all_users = (req, res) => {
    UserService.getAllUsers((err, user) => {
        if (err)
            return res.send(err);
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

        UserService.checkUserNotExists(new_user)
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
    UserService.getUserById(req.params.id, (err, user) => {
        if (err) {
            logger.debug('Error: '+ err);
            return res.send(err);
        }
        res.json(user);
    });
};
  
  
exports.update_an_user = (req, res) => {
    UserService.updateById(req.params.id, new User(req.body), (err, user) => {
        if (err) {
            logger.debug('Error: '+ err);
            return res.send(err);
        }
        res.json(user);
    });
};
  
  
exports.delete_an_user = (req, res) => {  
    UserService.deleteUser(req.params.id, (err, result) => {
        if (err) {
            logger.debug('Error: '+ err);
            return res.send(err);
        }
        res.json({ result: result, message: 'User [' + req.params.id + '] deleted successfully.' });
    });
};

exports.authenticate_an_user = async (req, res) => {

    const newUser = new User(req.body);
    logger.info('User id: ' + newUser.userid);

    await UserService.authenticateAnUser(newUser, (err, result) => {
        if (err) {
            logger.debug('Error: ' + err);
            return res.json("3. User ID/Password is not valid");
        }
        logger.debug('Result' + result)
        res.json(result);  
    });
};

exports.logout_an_user = (req, res) => { 
    res.status(200).send({
        auth: false, 
        token: null
    });
}