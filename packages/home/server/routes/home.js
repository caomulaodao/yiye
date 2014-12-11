'use strict';

// The Package is past automatically as first parameter
module.exports = function(Home, app, auth, database) {

    var home = require('../controllers/home.js');
    //home页面初始化
    app.get('/home',function (req,res,next){
        if(!req.user) res.redirect('/');
        home.initHome(req,res,Home);
    });

    //创建频道
    app.post('/api/channels/create',home.createChannel);

    //获取用户所有相关频道
    app.route('/api/channel/all')
        .get(home.getChannelsList);

    //已经查看某个通知
    app.route('/api/news/viewed')
        .post(home.newsViewed);

    //home中发现频道api
    app.route('/api/home/discover')
        .get(home.discover);
    //ajax加载频道中的书签
    app.route('/api/home/bookmark/')
        .get(home.ajaxBookmarks);
    //获取新消息
    app.route('/api/home/newmes')
        .get(home.newNews);
    //获取历史记录
    app.route('/api/home/hismes')
        .get(home.history);
    app.route('/api/home/callmsg')
        .get(home.callmsg);
    app.route('/api/home/checkmsg')
        .get(home.checkmsg);
}
