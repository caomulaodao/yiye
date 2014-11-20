'use strict';

var mean = require('meanio');

exports.render = function(req, res) {
    res.render('index');
};

exports.explore = function(req, res){
    res.render('explore');
}