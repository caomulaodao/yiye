'use strict';

var mean = require('meanio');

var mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User'),
    Channel2User = mongoose.model('Channel2User'),
    Channels = mongoose.model('Channels'),
    Bookmarks = mongoose.model('Bookmarks');

//渲染首页
exports.render = function(req, res,Package) {
    async.parallel([
        function(cb){
        User.count({},function(err,user_number){cb(err,user_number)});
        },
        function(cb){
            Channels.count({},function(err,channel_number){cb(err,channel_number)});
        },
        function(cb){
            Bookmarks.count({},function(err,label_number){cb(err,label_number)});
        }],function(err,result){
            if(err){
                console.log(err);
            }
            else{
                var user_number=result[0];
                var channel_number=result[1];
                var label_number=result[2];
                Package.render('index',{user_number:user_number,channel_number:channel_number,label_number:label_number},
                    function(err,html){
                    if(err) consoe.log(err);
                    res.send(html);
                    }
                )
            }
        })

};

//渲染发现页面
exports.explore = function(req, res,Package){
    var limit = 100;
    Channels.find().sort({subNum:1}).skip(0).limit(limit).exec(function (err, channels) {
        if(err) return console.log(err);
        Package.render('explore', {
            channels:channels
        }, function(err, html) {
            if(err) console.log(err);
            res.send(html);
        });
    });
}