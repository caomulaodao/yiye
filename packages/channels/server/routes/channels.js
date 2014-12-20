'use strict';

var channels = require('../controllers/channels.js');

// The Package is past automatically as first parameter
module.exports = function(Channels, app, auth, database) {

    //获取某个频道主页
    app.get('/channel/:channelId', function(req, res, next) {
        channels.renderMain(req,res,Channels);
    });
    //获取某个频道的订阅用户
    app.get('/channel/:channelId/follower', function(req, res, next) {
        channels.renderFollower(req,res,Channels);
    });
    //审核频道新提交的内容
    app.get('/channel/:channelId/check', function(req, res, next) {
        channels.renderCheck(req,res,Channels);
    });
    //订阅某个频道
    app.post('/channel/sub/',channels.sub);

    //更新频道信息
    app.post('/channel/:channelId/update',channels.update);

    //取消订阅某个频道
    app.post('/channel/noSub',channels.noSub);

};
