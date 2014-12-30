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
    Bugs = mongoose.model('Bugs'),
    myVerify = require('../../../../config/tools/verify');

    //渲染主页
    exports.renderMain = function(req,res,Package){
        //只有roles中添加了admin 或是 system的用户可以访问后台
        if(!(req.user && (req.user.roles.indexOf('admin')>-1 || req.user.roles.indexOf('system')>-1))){
            return res.redirect('/');
        }
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
        if(!(req.user && (req.user.roles.indexOf('admin')>-1 || req.user.roles.indexOf('system')>-1))){
            return res.redirect('/');
        }
        var limit = 50;//每页限制显示数
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
        //获取用户权限
        if(req.user.roles.indexOf('system') > -1){
            var role = 'system';
        }else{
            var role = 'admin';
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
            Package.render('user',{users:users,page:page,type:type,search:search,role:role}, function(err, html) {
                if(err) {console.log(err);return res.sendError()}
                res.send(html);
            });
        });
    };

    //渲染频道管理页面
    exports.renderChannel = function(req,res,Package){
        if(!(req.user && (req.user.roles.indexOf('admin')>-1 || req.user.roles.indexOf('system')>-1))){
            return res.redirect('/');
        }
        var limit = 50;//每页限制显示数
        var p=req.query.p||1;
        var search = req.query.q || '';
        var type = req.query.type || 'name';
        //获取用户权限
        if(req.user.roles.indexOf('system') > -1){
            var role = 'system';
        }else{
            var role = 'admin';
        }

        if (!myVerify.isNumber(p)){p=1;}//判断参数是否合法

        if(search == '' || type == ''){
            var query =  {};
        }else{
            console.log(type);
            switch(type){
                case 'name':
                    var query =  { name : new RegExp(search,'i') };
                    break;
                case 'id':
                    var query =  { _id : search };
                    break;
                case 'creator':
                    var query =  { 'creator.userName' : new RegExp(search,'i') };
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
            Package.render('channel',{channels:channels,page:page,type:type,search:search,role:role}, function(err, html) {
                if(err) {console.log(err);return res.sendError()}
                res.send(html);
            });
        });
    };

    exports.renderBugs = function (req, res, Package) {
      if(!(req.user && (req.user.roles.indexOf('admin')>-1 || req.user.roles.indexOf('system')>-1))){
        return res.redirect('/');
      }
      var limit = 50;//每页限制显示数
      var p=req.query.p||1;
      var search = req.query.q || '';
      var type = req.query.type || 'email';
      var role = '';
      var query = {};
      //获取用户权限
      if(req.user.roles.indexOf('system') > -1){
        role = 'system';
      }else{
        role = 'admin';
      }

      if (!myVerify.isNumber(p)){p=1;}//判断参数是否合法

      if(search == '' || type == ''){
        query =  {};
      }else{
        console.log(type);
        switch(type){
          case 'email':
            query =  { email: new RegExp(search,'i') };
            break;
          case 'bugzone':
            query =  { bugzone: new RegExp(search,'i') };
            break;
          default:
            query =  {};
        }
      }

      async.waterfall([
        function (cb) {
          Bugs.count(query, function (err, count) {
            if (err) {
              console.log(err);
              return res.sendError()
            }
            cb(err, count);
          });
        },
        function(count,callback){
          var pageLength = Math.ceil(count/limit),
            page = tool.skipPage(p,pageLength);
          var minPage;
          //防止大于翻页上限
          if(p>pageLength&&pageLength>0) minPage=pageLength;
          else minPage=p;
          //防止超过下限
          if (minPage<1){minPage=1;}
          Bugs.find(query).sort({time: 1}).skip(limit*(minPage-1)).limit(limit).exec(function (err, bugs){
            if(err) {console.log(err);return res.sendError()}
            callback(err,bugs,page);
          });
        }
      ],function(err, bugs, page){
        Package.render('bugs',{bugs:bugs,page:page,type:type,search:search,role:role}, function(err, html) {
          if(err) {console.log(err);return res.sendError()}
          res.send(html);
        });
      });
    };
    //删除某个Bug
    exports.bugDelete = function(req, res) {
      if(!(req.user &&  req.user.roles.indexOf('system')>-1)){
        return res.sendResult('对不起，无权限',2001,{});
      }
      var bugId = req.body.bugId;
      Bugs.remove({_id: bugId}, function (err) {
        if (err) {
          console.log(err);
          return res.error();
        }
        return res.sendResult('Bug删除成功', 0, {});
      })
    };
    //删除某个频道
    exports.channelDelete = function(req,res){
        if(!(req.user &&  req.user.roles.indexOf('system')>-1)){
            return res.sendResult('对不起，无权限',2001,{});
        }
        var channelId = req.body.channelId;

        async.parallel({
          channelDel: function(callback){
              Channels.remove({_id:channelId},function(err){
                    callback(err,true);
              });
          },
          creatorDel: function(callback){
              Channel2User.remove({channelId:channelId,type:"creator"},function(err,doc){
                  //删除创建者，并且删除创建者user表中的数量
                  if(doc.length > 0){
                      async.map(doc,function(item,callback){
                          User.update({_id:req.user._id},{$inc:{createNum:-1}},{},function(err,num){
                              if(err) {console.log(err);}
                              callback();
                          });
                      },function(err,results){
                          if (err) {console.log(err);return res.error();}
                          callback(err,true);
                      });

                  }else{
                      callback(err,true);
                  }
              });
          },
          followerDel: function(callback){
              Channel2User.remove({channelId:channelId,type:"follower"},function(err,doc){
                  //删除关注者，并且删除关注者user表中的数量
                  if(doc.length > 0){
                      async.map(doc,function(item,callback){
                          User.update({_id:req.user._id},{$inc:{subNum:-1}},{},function(err,num){
                              if(err){console.log(err);}
                              callback();
                          });
                      },function(err,results){
                          if (err) {console.log(err);return res.error();}
                          callback(err,true);
                      });

                  }else{
                      callback(err,true);
                  }
              });
          }
        },function(err,result){
            if (err) {console.log(err);return res.error();}
            return res.sendResult('频道删除成功',0,{});
        })
    };

    //设置用户管理员权限
    exports.setAdmin = function(req,res){
        if(!(req.user &&  req.user.roles.indexOf('system')>-1)){
            return res.sendResult('对不起，无权限',2001,{});
        }
        var userId = req.body.userId;//
        if (!Myverify.idVerify(userId)) {return res.sendRuselt('userId格式错误',2015,null);}
        User.update({_id:userId},{ $addToSet: { roles: "admin" }},function(err,num){
            if (err) {return res.sendError(err);}
            res.sendResult('添加成功',0,null);
        });
    }

    //取消用户后台权限
    exports.cancelAdmin = function(req,res){
        if(!(req.user &&  req.user.roles.indexOf('system')>-1)){
            return res.sendResult('对不起，无权限',2001,{});
        }
        var userId = req.body.userId;//
        if (!Myverify.idVerify(userId)) {return res.sendRuselt('userId格式错误',2015,null);}
        User.update({_id:userId},{ $pull: { roles: "admin" } },function(err,num){
            if (err) {return res.sendError(err);}
            res.sendResult('取消权限成功',0,null);
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
