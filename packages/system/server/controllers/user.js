/**
 * Created by laodao on 14-7-28.
 */
'use strict';

//var mean = require('meanio');
var config = require('meanio').loadConfig();
var qiniu = require('qiniu');

qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;

var uptoken = new qiniu.rs.PutPolicy(config.qiniu.Bucket_Name);


exports.signup = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/home');
    }
    res.render('signup');
};

exports.signin = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/home');
    }
    res.render('signin');
};

exports.verify = function(req, res) {
    res.render('verify',{emailServer : req.flash('emailServer')});
};

exports.forgot = function(req, res) {
    res.render('forgotEmail',{});
};

exports.waitReset = function(req, res) {
    res.render('waitReset',{emailServer : req.flash('emailServer')});
};

exports.resetPassword = function(req,res){
    res.render('resetPassword',{token : req.params.token});
};

exports.upToken = function(req,res,next){
    var token = uptoken.token();
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    if (token) {
        res.json({
            uptoken: token
        });
    }
}
