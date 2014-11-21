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
    Package.render('index', {
    }, function(err, html) {
        if(err) console.log(err);
        res.send(html);
    });

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