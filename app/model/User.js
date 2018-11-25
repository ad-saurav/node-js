'user strict';

const conn = require('./db.js'),
    bcrypt = require('bcryptjs'),
    logger = require('../logger/logger');

//User object constructor
var User = function(user) {
    this.userid = user.userid;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.password = user.password;
    this.created = new Date();
    this.modified = new Date();
};

User.getAllUsers = (result) => {
    conn.query("SELECT id, userid, first_name, last_name, created, modified FROM user", (err, res) => {

        if(err) {
            console.log("error: ", err);
            result(null, err);
        } else{
            console.log('user : ', res);  
            result(null, res);
        }
    });   
};

User.createUser = (newUser, result) => {  

    const salt = bcrypt.genSaltSync();
    const passwd = bcrypt.hashSync(newUser.password, salt);

    newUser.password = passwd;
    conn.beginTransaction(err => {
        if(err) result(err, null);

        conn.query("INSERT INTO user SET ?", newUser, (err, res) => {
    
            if(err) {
                console.log("Error:", err);
                result(err, null);
            } else {               
                conn.commit(err => {
                    if (err) { 
                        conn.rollback(() => {
                            result(err, null);
                        });
                    }
                    console.log('DB insert id:', res.insertId);
                    logger.debug('Transaction complete');
                    result(null, {'DB Insert ID:': res.insertId, 'Others': res});
                })
            }
        })
    })
};

User.getUserById = (id, result) => {
    conn.query("select id, userid, first_name, last_name, created, modified from user where id = ? ", [id], (err, res) => {             
        if(err) {
            logger.debug('Error: '+ err);
            console.log("error: ", err);
            result(err, null);
        } else{
            logger.debug('Result: '+ res);
            result(null, res);
        }
    });   
};


User.getUserByUserId = (user, result) => {
    conn.query("select userid, password from user where userid = ?", [user.userid], (err, res) => {             
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            if(typeof res != undefined && res.length >= 0) {
                logger.debug('Response: '+ res);
                result(null, new User(res[0]));
            } else {
                result(err, null);
            }
        }
    });   
};

User.checkUserNotExists = (user) => {
    return new Promise((resolve, reject) => {
        conn.query("select userid, password from user where userid = ?", [user.userid], (err, res) => { 

            if(err || (typeof res == undefined  || res.length <= 0)) {
                logger.debug('Error: '+ err);
                resolve('User does not exists');
            }
            reject('User already exists')
        }) 
    })
};

User.updateById = (id, user, result) => {
    conn.query("UPDATE user SET first_name = ?, last_name = ?, password = ? WHERE id = ?", [user.first_name, user.last_name,user.password, id], (err, res) => {
        if(err) {
            logger.debug('Error: '+ err);
            console.log("error: ", err);
            result(null, err);
        } else{   
            result(null, res);
        }
    }); 
};

User.deleteUser = (id, result) => {
    conn.query("DELETE FROM user WHERE id = ?", [id], (err, res) => {
        if(err) {
            logger.debug('Error: '+ err);
            console.log("error: ", err);
            result(null, err);
        } else{
            result(null, res);
        }
    }); 
};

User.comparePassword = (textPass, encryptedPasswd,) => {

    return new Promise((resolve, reject) => {
        bcrypt.compareSync(textPass, encryptedPasswd, (err, success) => {
            if(err) reject(err);
            resolve(success);
        });
    });
};

module.exports= User;