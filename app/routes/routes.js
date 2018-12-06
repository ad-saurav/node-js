'use strict';

module.exports = (app, upload) => {
    var userControllers = require('../controller/UserController');
    var fileControllers = require('../controller/FileHandlingController');
    let verifyToken = require('../middleware/verifyToken');

    // User Controller Routes
    app.route('/users')
        .get(verifyToken, userControllers.list_all_users)
        .post(userControllers.create_an_user);

    app.route('/login')
        .post(userControllers.authenticate_an_user);

    app.route('/users/:id')
        .get(verifyToken, userControllers.read_an_user)
        .put(verifyToken, userControllers.update_an_user)
        .delete(verifyToken, userControllers.delete_an_user);

    // File Handling Controller Routes
    app.route('/files')
        .get(verifyToken, fileControllers.list_all_files)
        .post(verifyToken, upload.any(), fileControllers.upload_a_file);

    app.route('/files/:filename')
        .get(verifyToken, fileControllers.download_a_file)
};