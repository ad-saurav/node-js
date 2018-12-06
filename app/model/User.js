'user strict';

//User object constructor
var User = function(user) {
    this.userid = user.userid;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.password = user.password;
    this.created = new Date();
    this.modified = new Date();
};

module.exports = User;