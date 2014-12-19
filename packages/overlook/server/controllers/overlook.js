var mongoose = require('mongoose'),
    async = require('async'),
    bookmarks = require('../../../bookmarks/server/controllers/bookmarks'),
    xss =require('xss'),
    moment = require('moment'),
    User = mongoose.model('User'),
    tool = require('../../../../config/tools/tool');
    Channel2User = mongoose.model('Channel2User'),
    Channels = mongoose.model('Channels'),
    Bookmarks = mongoose.model('Bookmarks'),
    BookmarkLike = mongoose.model('BookmarkLike');
    Myverify = require('../../../../config/tools/verify');
//传入用户Id删除某个指定用户 
exports.deleteUserById = function(req,res){
    if (!req.user) {return res.sendRuselt("你不是管理员",1002,null);}
    var userId = req.body.userId;//
    if (!Myverify.idVerify(userId)) {return res.sendRuselt('userId格式错误',2015,null);}
    User.findByIdAndRemove(userId,function(doc,err){
        if (err) {return res.sendError(err);}
        if (!doc) {return res.sendRuselt('你所查找的用户不存在');}
        res.sendRuselt('删除成功',0,null);
    })
}
//指定用户名删除某个用户
// exports.deleteUserByName = function(req,res){
//     if (!req.user) {return res.sendRuselt("你不是管理员",1002,null);}
//     var userName = req.body.userName;//
//     if (!Myverify.userVerify(userName)) {return res.sendRuselt('用户名格式错误',2015,null);}
//     async.waterfall([
//         function(callback){
//             User.findOneAndRemove({'username':userName},function(doc,err){
//                 if (err) {return res.sendError(err);}
//                 if (!doc) {return res.sendRuselt('你所查找的用户不存在');}
//                 callback(err);
//                 res.sendRuselt('删除成功',0,null);
//             })
//         },
//         function(callback){

//         }
        
//     ],fucntion(err,result){

//     })
// }
//指定用户名 查找出关于该用户的一切信息
// exports.findUserByName = function(req,res){
//     if (!req.user) {return res.sendRuselt('你不是管理员',1002,null);}
//     var userName = req.body.userName;
//     if (!Myverify.userVerify(userName)) {return res.sendRuselt('用户名格式错误',2015,null);}    
//     async.parallel({
//         user: function(callback){
//             User.findOne({'username':userName},function(err,doc){
//                 if (err) {return res.sendError();}
//                 callback(err,doc);
//             })
//         },

//     },function(err,result){

//     })
// }