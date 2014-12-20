var mongoose = require('mongoose'),
    async = require('async'),
    bookmarks = require('../../../bookmarks/server/controllers/bookmarks'),
    xss =require('xss'),
    moment = require('moment'),
    User = mongoose.model('User'),
    tool = require('../../../../config/tools/tool'),
    Channel2User = mongoose.model('Channel2User'),
    Channels = mongoose.model('Channels'),
    Bookmarks = mongoose.model('Bookmarks'),
    BookmarkLike = mongoose.model('BookmarkLike'),
    Myverify = require('../../../../config/tools/verify');

exports.renderMain = function(req,res,Package){
    Package.render('index',{}, function(err, html) {
        if(err) {console.log(err);return res.sendError()}
        res.send(html);
    });
}
