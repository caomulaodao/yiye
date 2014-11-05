'use strict';

// User routes use users controller
var bookmarks = require('../controllers/bookmarks.js');

//bookmarks route api
module.exports = function(Bookmarks, app, auth, database) {

    //接受新提交的bookmarks
    app.route('/api/bookmarks/post')
        .post(bookmarks.receive);

    //获取某个频道的bookmarks列表
    //app.route('/api/bookmarks/:channelId/:time')
    //   .post(bookmarks.);

    //获取某个频道的初始化列表
    app.route('/api/bookmarks/init/:channelId')
        .get(bookmarks.init);

    //用户支持书签
    app.route('/api/bookmarks/like/:bookmarkId')
        .get(bookmarks.like);
    //用户反对书签
    app.route('/api/bookmarks/hate/:bookmarkId')
        .get(bookmarks.hate);

    //获取离请求日期最近的某天的所有书签
    app.route('/api/bookmarks/oneDay/:channelId')
        .get(bookmarks.oneDay);
};