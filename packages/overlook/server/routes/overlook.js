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

    //删除某个用户
    app.post('/overlook/deleteUser',function(req, res, next) {
      index.deleteUser(req,res);
    });

    //删除某个频道
    app.get('/overlook/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/overlook/example/render', function(req, res, next) {
        Overlook.render('index', {
          package: 'overlook'
        }, function(err, html) {
          //Rendering a view from the Package server/views
          res.send(html);
        });
    });

};
