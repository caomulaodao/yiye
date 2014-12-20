'use strict';

var overlook = require('../controllers/overlook.js');


// The Package is past automatically as first parameter
module.exports = function(Overlook, app, auth, database) {
    //获取个人主页
    app.get('/overlook', function(req, res, next) {
        overlook.renderMain(req,res,Overlook);
    });
};
