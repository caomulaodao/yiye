/**
 * Created by laodao on 14/10/29.
 */

var mongoose = require('mongoose'),
    async = require('async'),
    moment = require('moment'),
    tool = require('../../../../config/tools/tool'),
    verify=require('../../../../config/tools/verify'),
    xss = require('xss'),
    User = mongoose.model('User'),
    Bookmarks = mongoose.model('Bookmarks'),
    Channels = mongoose.model('Channels'),
    Channel2User = mongoose.model('Channel2User'),
    BookmarkLike = mongoose.model('BookmarkLike'),
    BookmarkHate = mongoose.model('BookmarkHate');

//展示频道中的书签


exports.renderMain = function(req,res,Package){
    var channelId = req.params['channelId'];
    if(!verify.idVerify(channelId)) {return res.sendResult('参数格式错误',2001,null)}
    //每页显示的数量
    var limit=10;
    var p=req.query.p||1;
    async.waterfall([
        function(callback){
            var type = 'not';
            //判断访问者是否登录
            if(req.user){
                Channel2User.findOne({channelId: channelId,userId:req.user._id}, function (err, doc) {
                    if(err){console.log(err);return res.sendError()}
                    if (doc) {
                        if (doc.type == 'admin' || doc.type == 'creator') {
                            type = 'admin';
                        } else if (doc.type == 'follower') {
                            type = 'follower';
                        }
                    }
                    callback(null,type);
                });
            }else{
                callback(null,type);//拜访者类型
            }
        },
        //对应的频道
        function (type,callback) {
            Channels.findOne({_id: channelId}, function (err, channel) {
                if(err){console.log(err);return res.sendError();}
                callback(null,type,channel);
            });
        },
        //书签总数
        function(type,channel,callback){
            Bookmarks.count({channelId:channelId,checked:{$in:[1,3,5]}},function(err,count){
                if (err) {console.log(err);return res.sendError()}
                var pageLength=Math.ceil(count/limit);
                callback(null,type,channel,pageLength);
            })
        },
        //对应频道的书签
        function(type,channel,pageLength,callback){
            var minPage;
            //防止大于翻页上限
            if(p>pageLength&&pageLength>0) minPage=pageLength;
            else minPage=p;
            //防止超过下限
            if (minPage<1){minPage=1;}
            Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]}}).sort({postTime:-1}).skip((minPage-1)*limit).limit(limit).exec(function (err, doc) {
                if(err) {console.log(err);return res.sendError()}
                if(doc.length === 0) return callback(null,type,channel,pageLength,[]);
                callback(null,type,channel,pageLength,listToArray(doc));
            });
        }],
        function(err,type,channel,pageLength,list){
            if(!channel) return res.redirect('/');
            var channel = channel;
            var list = list;
            var page = tool.skipPage(p,pageLength);
            channel.userType =type;
            Package.render('index', {
                channel:channel,
                list:list,
                page:page,
                user:req.user
            }, function(err, html) {
                if(err) {console.log(err);return res.sendError()}
                res.send(html);
            });
        });

}
//频道订阅
exports.sub = function(req,res){
    if(!req.user) return res.sendResult('请先登陆或注册',1000,null);
    var channelId = req.body['channelId'];
    if(!verify.idVerify(channelId)) {return res.sendResult('参数格式错误',2001,null)}
    //判断是否已经订阅
    Channel2User.findOne({channelId:channelId,userId:req.user._id},function(err,doc) {
        if (err) {console.log(err);return res.sendError()}
        if(doc){
            //如果已经订阅，则返回信息。
            return  res.sendResult('你已经订阅或是创建该频道',3000,null);
        }else{
            //如果没有订阅，则开始订阅流程
            async.waterfall([
                function(callback){
                    //查找频道信息
                    Channels.findOne({_id:channelId},function(err,doc){
                        if (err) {console.log(err);return res.sendError()}
                        callback(null,doc);
                    });
                },
                function(channel,callback){
                    //添加关注者与频道对应表
                    var follower = Channel2User({
                        channelId : channelId,
                        userId : req.user._id,
                        username :req.user.username,
                        userLogo: req.user.avatar
                        type : 'follower',
                        name : channel.name,
                        logo : channel.logo
                    });
                    follower.save(function(err){
                        if(err) {console.log(err);return res.sendError()}
                        //更新频道订阅数
                        callback(null);
                    });
                },
                function(callback){
                    //更新频道关注数量
                    Channels.update({_id:channelId},{$inc:{subNum:1}},{},function(err,num){
                        if(err) {console.log(err);return res.sendError()}
                        callback(null);
                    });
                },
                function(callback){
                    //更新用户关注数量
                    User.update({_id:req.user._id},{$inc:{subNum:1}},{},function(err,num){
                        if(err) {console.log(err);return res.sendError()}
                        callback(null);
                    });
                }
            ],function(err){
                if(err) {console.log(err);res.sendError()}
                res.sendResult('订阅成功',0,null);
            });
        }

    });
};

//展示订阅用户
exports.renderFollower = function(req,res,Package){
    var channelId = req.params['channelId'];
    if(!verify.idVerify(channelId)) {return res.sendResult('参数格式错误',2001,null)}
    var p=req.query.p||1;
    if(!verify.isNumber(p)) {return res.sendResult('参数类型错误',2000,null)}
    p=+p;
    var limit=12;
    var min_page;
    async.parallel({
            userType:function(callback){
                var type = 'not';
                if(req.user){
                    Channel2User.findOne({channelId: channelId,userId:req.user._id}, function (err, doc) {
                        if (err) {console.log(err);res.sendError()}
                        if (doc) {
                            if (doc.type == 'admin' || doc.type == 'creator') {
                                type = 'admin';
                            } else if (doc.type == 'follower') {
                                type = 'follower';
                            }
                        }
                        callback(null,type);
                    });
                }else{
                    callback(null,type);
                }
            },
            channel:function (callback) {
                Channels.findOne({_id: channelId}, function (err, channel) {
                    if (err){console.log(err);res.sendError()}
                    callback(null,channel);
                });
            },
            users:function(callback){
                    async.waterfall([
                        function(callback){
                            //创建者ID
                            Channel2User.findOne({channelId: channelId,type:'creator'},function(err,creator){
                                var creatorId = creator['userId'];
                                callback(null,creatorId);
                            });
                        },
                        //管理员ID
                        function(creatorId,callback){
                            Channel2User.find({channelId: channelId,type:'admin'},function(err,admins){
                                var adminsId = admins.map(function(item){
                                    return item['userId'];
                                });
                                callback(null,creatorId,adminsId);
                            });
                        },
                        function(creatorId,adminsId,callback){
                            //关注者数量（不包含创建者和管理员）
                            var creator=1;
                            var count = Channel2User.count({channelId:channelId,type:'follower'},function(err,count){
                                if (err){console.log(err);return res.sendError();}
                                var pageLength=Math.ceil((count+creator+adminsId.length)/limit);
                                callback(null,creatorId,adminsId,pageLength);
                            });             
                        },
                        function(creatorId,adminsId,pageLength,callback){
                            var creator=1;
                            var followerNum;
                            var minPage;
                            //防止大于翻页上限
                            if(p>pageLength&&pageLength>0) {minPage=pageLength;}
                            else {minPage=p;}
                            //防止超过下限
                            if (minPage<1){minPage=1;}min_page=minPage;
                            var skipnumber;
                            if(minPage===1){followerNum=limit-creator-adminsId.length;skipnumber=0}
                            else{followerNum=limit;skipnumber=limit*(minPage-1)-creator-adminsId.length}
                            Channel2User.find({channelId: channelId,type:'follower'}).sort({followerTime:-1}).skip(skipnumber).limit(followerNum).exec(function (err, followers) {
                                
                                var followersId = followers.map(function(item){
                                    return item['userId'];
                                });
                                callback(null,creatorId,adminsId,pageLength,followersId);
                            });
                        }
                    ],function(err,creatorId,adminsId,pageLength,followersId){
                        if(err) {console.log(err);return res.sendError()}
                        async.parallel({
                                creator: function(callback){
                                    User.findOne({_id:creatorId},function(err,creator){
                                        if(err) {console.log(err);return res.sendError()}
                                        callback(null,creator);
                                    });
                                },
                                admins: function(callback){
                                    User.find({_id:{$in:adminsId}},function(err,admins){
                                        if(err) {console.log(err);return res.sendError()}
                                        callback(null,admins);
                                    });
                                },
                                 followers: function(callback){
                                     User.find({_id:{$in:followersId}}).sort({postNum:-1}).exec(function(err,followers){
                                         if(err) {console.log(err);return res.sendError()}
                                         callback(null,followers);
                                     });
                                 },
                                 pageLength:function(callback){
                                    callback(null,pageLength);
                                 }
                        },
                        function(err, results) {
                            if(err) {console.log(err);return res.sendError()}
                            callback(null,results);
                        });
                    });
            }
        },
        function(err,results){
            if(err) {console.log(err);return res.sendError()}
            if(!results.channel) return res.redirect('/');
            var channel = results.channel;
            channel.userType = results.userType;
            var users = results.users;
            var page=tool.skipPage(p,results.users.pageLength);
            if (min_page>1){users.creator=null;users.admins=null}
            Package.render('follower', {
                channel:channel,
                users:users,
                user:req.user,
                page:page
            }, function(err, html) {
                if(err) {console.log(err);return res.sendError()}
                res.send(html);
            });
        });
};

//展示未审核内容
exports.renderCheck = function(req,res,Package){
    var channelId = req.params['channelId'];
    if(!Myverify.idVerify(channelId)) {return res.sendResult('参数格式错误',2001,null)}
    var limit=6;
    var p=req.query.p||1;
    if(!Myverify.isNumber(p)) {return res.sendResult('参数类型错误',2000,null)}
    p=+p;
    async.waterfall([
            function(callback){
                var type = 'not';
                if(req.user){
                    Channel2User.findOne({channelId: channelId,userId:req.user._id}, function (err, doc) {
                        if (err) {console.log(err);return res.sendError();}
                        if (doc) {
                            if (doc.type == 'admin' || doc.type == 'creator') {
                                type = 'admin';
                            } else if (doc.type == 'follower') {
                                type = 'follower';
                            }
                        }
                        callback(null,type);
                    });
                }else{
                    callback(null,type);
                }
            },
            function (type,callback) {
                Channels.findOne({_id: channelId}, function (err, channel) {
                    if (err) {console.log(err);return res.sendError();}
                    callback(null,type,channel);
                });
            },
            function(type,channel,callback){
                Bookmarks.count({channelId:channelId,checked:0},function(err,count){
                    if (err) {console.log(err);res.sendError()}
                    callback(null,type,channel,count);
                })
            },
            function(type,channel,count,callback){
                var pageLength=Math.ceil(count/limit);
                var minPage;
                //防止大于翻页上限
                if(p>pageLength&&pageLength>0) minPage=pageLength;
                else minPage=p;
                //防止超过下限
                if (minPage<1){minPage=1;}           
                Bookmarks.find({channelId:channelId,checked:0}).sort({postTime:-1}).skip(limit*(minPage-1)).limit(limit).exec(function (err, doc) {
                    if(err) {console.log(err);res.sendError()}
                    if(doc.length === 0) return callback(null,type,channel,pageLength,[]);
                    callback(null,type,channel,pageLength,doc);
                });
            }],
        function(err,type,channel,pageLength,doc){
            if(!channel) return res.redirect('/');
            var channel = channel;
            var list = doc;
            var page=tool.skipPage(p,pageLength);
            channel.userType = type;
            Package.render('manage', {
                channel:channel,
                list:list,
                page:page
            }, function(err, html) {
                if(err) {console.log(err);res.sendError()}
                res.send(html);
            });
        });
};

//更新频道信息
exports.update = function(req,res){
    var channelId = req.params['channelId'];
    if(!verify.idVerify(channelId)) {return res.sendError('参数格式错误',2001,null)}
    var nameLength=20,descriptionLength=100;
    if (!req.body.name) return res.sendResult('频道名称不能为空',2002,null);
    if (!req.body.logo) return res.sendResult('logo不能为空',2003,null);
    if (!req.body.description) return res.sendResult('频道描述不能为空',2004,null);
    if (!req.body.tags) return res.sendResult('标签不能为空',2005,null);
    if (!req.body.type) return res.sendResult('频道类型不能为空',2006,null);
    if (typeof req.body.name!='string'
        ||typeof req.body.logo!='string'
        ||typeof req.body.description!='string'
        ||typeof req.body.tags!='string'
        ||typeof req.body.type!='string'){
        return res.sendResult('参数类型错误',2000,null);}//频道资料不规范
    //更新各处中的个人信息
    async.parallel([
        //更新频道表Channels中的用户信息
        function(callback){
            //xss过滤
            var update = {
                logo:xss(req.body.logo,{whiteList:{}}),
                name:xss(req.body.name,{whiteList:{}}),
                description:xss(req.body.tags,{whiteList:{}}),
                type:xss(req.body.type,{whiteList:{}}),
                tags:xss(req.body.tags,{whiteList:{}})
            };
            //Channels update
            Channels.update({_id:channelId},update,function(err,doc){
                if(err)  {console.log(err);return res.sendError()}
                callback(null);
            });
        },
        //更新Channel2User表中的频道信息
        function(callback){
            //更新 name & logo
            var update = {
                logo:xss(req.body.logo,{whiteList:{}}),
                name:xss(req.body.name,{whiteList:{}})
            };
            //Channel2User update
            Channel2User.update({channelId:channelId},update,{ multi: true },function(err,doc){
                if(err) {console.log(err);return res.sendError()}
                callback(null);
            });
        }
    ],
    //返回信息
    function(err, results){
        if(err)  {console.log(err);return res.sendError()}
        //修改成功
        return res.sendResult('数据修改成功',0,null)
    });

}

//取消订阅某个频道
exports.noSub = function(req,res){
    var channelId = req.body['channelId'];
    if(!verify.idVerify(channelId)) {return res.sendResult('参数格式错误',2001,null)}
    if(!req.user) return res.redirect('/');
    
    //删除频道用户关系表
    Channel2User.remove({channelId:channelId,userId:req.user._id},function(err,num){
        if(err) { console.log(err);return res.sendError()}
        if(num>0){

            //更新频道表中订阅者记录
            Channels.update({_id:channelId},{$inc:{subNum:-1}},{},function(err,doc){
                if(err) {console.log(err);return res.sendError()}

                //更新用户关注数量
                User.update({_id:req.user._id},{$inc:{subNum:-1}},{},function(err,num){
                    if(err) {console.log(err);return res.sendError()}

                    //刷新页面
                    res.redirect('/channel/'+channelId);
                });

            });

        }else{
            res.redirect('/channel/'+channelId);
        }
    });
}

//将一个bookmarks列表格式化为按时间集合排序的数组。
function listToArray(list){
    var result = [];
    var lastTime = list[0]['postTime'];
    var index = 0;
    for(var i= 0;i<list.length;i++){
        if(!moment(lastTime).isSame(list[i]['postTime'], 'day')){
            index++;
            lastTime = list[i]['postTime'];
        }
        if(result[index]){
            var day = moment(list[i]['postTime']).format('YYYY-MM-DD');
            result[index]['dList'].push(list[i]);
        }else{
            var day = moment(list[i]['postTime']).format('YYYY-MM-DD');
            result[index] = {};
            result[index]['day'] = day;
            result[index]['dList'] = [];
            result[index]['dList'].push(list[i]);
        }
    }
    result.map(function(item){
        item['dList'].sort(function(a,b){
            var aRank = a['likeNum'] - a['hateNum'];
            var bRank = b['likeNum'] - b['hateNum'];
            return aRank > bRank ? -1 : 1;
        })
    });
    return result;
}