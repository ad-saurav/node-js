'user strict';

const conn = require('../model/db'),
    bcrypt = require('bcryptjs'),
    logger = require('../logger/logger'),
    User = require("../model/User");

exports.getAllUsers = async (result) => {
    await conn.query("SELECT id, userid, first_name, last_name, created, modified FROM user", (err, res) => {

        if(err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            console.log('All Users : ', res);  
            result(null, res);
        }
    });   
};

exports.createUser = async (newUser, result) => {  

    const salt = await bcrypt.genSaltSync();
    const passwd = await bcrypt.hashSync(newUser.password, salt);

    newUser.password = passwd;
    await conn.beginTransaction(err => {
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

exports.getUserById = async (id, result) => {
    await conn.query("select id, userid, first_name, last_name, created, modified from user where id = ? ", [id], (err, res) => {             
        if(err) {
            logger.debug('Error: '+ err);
            console.log("error: ", err);
            result(err, null);
        } else {
            if (typeof res != undefined && res.length > 0) {
                logger.debug('Result: '+ res);
                console.log("User: ", res);
                result(null, res);
            } else {
                console.log("No User found with the id : ", id);
                result('No User found with the id : ' + id, null);
            }
        }
    });   
};


exports.getUserByUserId = async (user, result) => {

    await conn.query("select userid, password from user where userid = ?", [user.userid], (err, res) => {             
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            if(typeof res != undefined && res.length > 0) {
                logger.debug('Response: '+ JSON.stringify(res));
                result(null, new User(res[0]));
            } else {
                result(err, null);
            }
        }
    });   
};

exports.checkUserNotExists = async (userid, result ) => {
    await conn.query("select userid, password from user where userid = ?", [userid], (err, res) => { 

        if(err || (typeof res == undefined  || res.length <= 0)) {
            logger.debug('Error: '+ err);
            result(null, 'User does not exists');
        }
        result('User already exists', null)
    }) 
};

exports.checkUserExistsByID = async (userid, result ) => {
    await conn.query("select userid, password from user where userid = ?", [userid], (err, res) => { 

        if(err || (typeof res == undefined  || res.length <= 0)) {
            logger.debug('Error: '+ err);
            result('User does not exists', null);
        }
        result(null, 'User exists')
    }) 
};

exports.updateById = (id, user, result) => {

    conn.beginTransaction(async err => {
        if(err) result(err, null);

        await conn.query("UPDATE user SET first_name = ?, last_name = ?, password = ? WHERE id = ?", [user.first_name, user.last_name,user.password, id], (err, res) => {
            if(err) {
                logger.debug('Error: '+ err);
                console.log("error: ", err);
                result(null, err);
            } else{   
                result(null, res);
            }
        })
    });
};

exports.deleteUser = (id, result) => {
    conn.beginTransaction(async err => {
        if(err) result(err, null);

        await checkUserExistsByID(id, async (err, res) => {
            if(err) {
                logger.debug('Error : ' + err);
                result('Error in deleting user with id [' + id + ']', null)
            }
            
            await conn.query("DELETE FROM user WHERE id = ?", [id], (err, res) => {
                if(err) {
                    logger.debug('Error: '+ err);
                    console.log("error: ", err);
                    result(err, null);
                } else {
                    result(null, res);
                }
            })            
        })
    });
};


exports.comparePassword = (textPass, encryptedPasswd) => {
    return bcrypt.compareSync(textPass, encryptedPasswd, (err, success) => {
        if(err) throw err;
        return success;
    });
};