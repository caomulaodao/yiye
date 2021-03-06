'use strict';

// 引入person控制器
var person = require('../controllers/person.js');

// The Package is past automatically as first parameter
module.exports = function(Person, app, auth, database) {

    //获取个人主页 & 即关注的频道
    app.get('/u/:userId', function(req, res, next) {
        person.renderWatch(req,res,Person);
    });

    //获取个人提交的书签
    app.get('/u/:userId/post', function(req, res, next) {
        person.renderPost(req,res,Person);
    });

    //获取个人创建或管理的频道
    app.get('/u/:userId/create', function(req, res, next) {
        person.renderCreate(req,res,Person);
    });


};
