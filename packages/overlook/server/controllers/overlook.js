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
    myVerify = require('../../../../config/tools/verify');

    //渲染主页
    exports.renderMain = function(req,res,Package){
        async.parallel([
            function(cb){
                User.count({},function(err,user_number){cb(err,user_number)});
            },
            function(cb){
                Channels.count({},function(err,channel_number){cb(err,channel_number)});
            },
            function(cb){
                Bookmarks.count({checked:{$in:[1,3,5]}},function(err,label_number){cb(err,label_number)});
            }],function(err,result){
            if(err){
                console.log(err);
                res.sendError();
            }else{
                var user_number=result[0];
                var channel_number=result[1];
                var label_number=result[2];
                Package.render('index',{user_number:user_number,channel_number:channel_number,label_number:label_number,user:req.user}, function(err, html) {
                    if(err) {console.log(err);return res.sendError()}
                    res.send(html);
                });
            }
        })

    };

    //渲染用户管理页面
    exports.renderUser = function(req,res,Package){
        var limit = 2;//每页限制显示数
        var p=req.query.p||1;
        var search = req.query.q || '';
        var type = req.query.type || 'username';

        if (!myVerify.isNumber(p)){p=1;}//判断参数是否合法

        if(search == '' || type == ''){
            var query =  {};
        }else{
            console.log(type);
            switch(type){
                case 'username':
                    var query =  { username : new RegExp(search,'i') };
                    break;
                case 'email':
                    var query =  { email : new RegExp(search,'i') };
                    break;
                default:
                    var query =  {};
            }
        }

        async.waterfall([
            function(cb){
                User.count(query,function(err,count){
                    if(err){console.log(err);return sendError()}
                    cb(err,count);
                });
            },
            //所有热门频道 按关注度排行
            function(count,callback){
                var pageLength = Math.ceil(count/limit),
                    page = tool.skipPage(p,pageLength);
                var minPage;
                //防止大于翻页上限
                if(p>pageLength&&pageLength>0) minPage=pageLength;
                else minPage=p;
                //防止超过下限
                if (minPage<1){minPage=1;}
                User.find(query).sort({postNum:-1}).skip(limit*(minPage-1)).limit(limit).exec(function (err, users){
                    if(err) {console.log(err);return res.sendError()}
                    callback(err,users,page);
                });
            }
        ],function(err,users,page){
            Package.render('user',{users:users,page:page,type:type,search:search}, function(err, html) {
                if(err) {console.log(err);return res.sendError()}
                res.send(html);
            });
        });
    };

    //渲染频道管理页面
    exports.renderChannel = function(req,res,Package){
        var limit = 2;//每页限制显示数
        var p=req.query.p||1;
        var search = req.query.q || '';
        var type = req.query.type || 'name';

        if (!myVerify.isNumber(p)){p=1;}//判断参数是否合法

        if(search == '' || type == ''){
            var query =  {};
        }else{
            console.log(type);
            switch(type){
                case 'username':
                    var query =  { username : new RegExp(search,'i') };
                    break;
                case 'email':
                    var query =  { email : new RegExp(search,'i') };
                    break;
                default:
                    var query =  {};
            }
        }

        async.waterfall([
            function(cb){
                Channels.count(query,function(err,count){
                    if(err){console.log(err);return sendError()}
                    cb(err,count);
                });
            },
            //所有热门频道 按关注度排行
            function(count,callback){
                var pageLength = Math.ceil(count/limit),
                    page = tool.skipPage(p,pageLength);
                var minPage;
                //防止大于翻页上限
                if(p>pageLength&&pageLength>0) minPage=pageLength;
                else minPage=p;
                //防止超过下限
                if (minPage<1){minPage=1;}
                Channels.find(query).sort({subNum:-1}).skip(limit*(minPage-1)).limit(limit).exec(function (err, channels){
                    if(err) {console.log(err);return res.sendError()}
                    callback(err,channels,page);
                });
            }
        ],function(err,channels,page){
            Package.render('channel',{channels:channels,page:page,type:type,search:search}, function(err, html) {
                if(err) {console.log(err);return res.sendError()}
                res.send(html);
            });
        });
    };


    //传入用户Id删除某个指定用户
    exports.deleteUserById = function(req,res){
        if (!req.user) {return res.sendRuselt("你不是管理员",1002,null);}
        var userId = req.body.userId;//
        if (!Myverify.idVerify(userId)) {return res.sendRuselt('userId格式错误',2015,null);}
        User.findByIdAndRemove(userId,function(doc,err){
            if (err) {return res.sendError(err);}
            if (!doc) {return res.sendRuselt('你所查找的用户不存在');}
            res.sendRuselt('删除成功',0,null);
        });
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
