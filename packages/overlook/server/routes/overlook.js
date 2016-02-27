'use strict';

var overlook = require('../controllers/overlook.js');


// The Package is past automatically as first parameter
module.exports = function(Overlook, app, auth, database) {

    //管理主页
    app.get('/overlook', function(req, res, next) {
        overlook.renderMain(req, res, Overlook);
    });

    //管理用户
    app.get('/overlook/user', function(req, res, next) {
        overlook.renderUser(req, res, Overlook);
    });

    //管理频道
    app.get('/overlook/channel', function(req, res, next) {
        overlook.renderChannel(req, res, Overlook);
    });
    //管理Bugs
    app.get('/overlook/bugs', function(req, res, next) {
        overlook.renderBugs(req, res, Overlook);
    });
    //删除某个频道
    app.post('/api/overlook/channelDelete',overlook.channelDelete);

    //删除某个Bug
    app.post('/api/overlook/bugDelete',overlook.bugDelete);

    //设置用户后台权限
    app.post('/api/overlook/setAdmin',overlook.setAdmin);

    //取消用户后台权限
    app.post('/api/overlook/cancelAdmin',overlook.cancelAdmin);


};
