/**
 * Created by laodao on 14/10/29.
 */

var mongoose = require('mongoose'),
    async = require('async'),
    moment = require('moment'),
    tool = require('../../../../config/tools/tool')
    User = mongoose.model('User'),
    Bookmarks = mongoose.model('Bookmarks'),
    Channels = mongoose.model('Channels'),
    Channel2User = mongoose.model('Channel2User'),
    BookmarkLike = mongoose.model('BookmarkLike'),
    BookmarkHate = mongoose.model('BookmarkHate');

//展示频道中的书签


exports.renderMain = function(req,res,Package){
    var channelId = req.params['channelId'];
    //每页显示的数量
    var limit=10;
    var p=req.query.p||1;
    async.waterfall([
        function(callback){
            var type = 'not';
            //判断访问者是否登录
            if(req.user){
                Channel2User.findOne({channelId: channelId,userId:req.user._id}, function (err, doc) {
                    if (doc) {
                        //console.log(doc);
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
                console.log(channel);
                callback(null,type,channel);
            });
        },
        //书签总数
        function(type,channel,callback){
            Bookmarks.count({channelId:channelId,checked:{$in:[1,3,5]}},function(err,count){
                if (err) return console.log(err);
                var pageLength=Math.ceil(count/limit);
                console.log(channel);
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
                if(err) console.log(err);
                if(doc.length === 0) return callback(null,type,channel,pageLength,[]);
                callback(null,type,channel,pageLength,listToArray(doc));
            });
        }],
        function(err,type,channel,pageLength,list){
            console.log(type);
            console.log(channel);
            if(!channel) return res.redirect('/');
            var channel = channel;
            var list = list;
            var page = tool.skipPage(p,pageLength);
            channel.userType =type;
            Package.render('index', {
                channel:channel,
                list:list,
                page:page
            }, function(err, html) {
                if(err) console.log(err);
                res.send(html);
            });
        });

}
//频道订阅
exports.sub = function(req,res){
    var channelId = req.params['channelId'];
    if(!req.user) return res.send({err:true,info:'请先登陆或注册'});
    Channel2User.findOne({channelId:channelId},function(err,doc){
        if(err) return console.log(err);
        if(doc.userId == req.user._id) return  res.send({err:true,info:'你已经订阅或是创建该频道'});
        var follower = Channel2User({
            channelId : channelId,
            userId : req.user._id,
            type : 'follower',
            name : doc.name,
            logo : doc.logo
        });
        follower.save(function(err){
            if(err) return console.log(err);
            Channels.update({_id:channelId},{$inc:{subNum:1}},{},function(err,doc){
                if(err) console.log(err);
                res.send({success:true,info:'订阅成功'});
            });
        });
    });
};

//展示订阅用户
exports.renderFollower = function(req,res,Package){
    var channelId = req.params['channelId'];
    var page = req.body.page;
    var p=req.query.p||1;
    var limit=30;
    async.parallel({
            userType:function(callback){
                var type = 'not';
                if(req.user){
                    Channel2User.findOne({channelId: channelId,userId:req.user._id}, function (err, doc) {
                        if (doc) {
                            //console.log(doc);
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
                    callback(null,channel);
                });
            },
            users:function(callback){
                if(!page || page === 1){
                    async.waterfall([
                        function(callback){
                            Channel2User.findOne({channelId: channelId,type:'creator'},function(err,creator){
                                var creatorId = creator['userId'];
                                callback(null,creatorId);
                            });
                        },
                        function(creatorId,callback){
                            Channel2User.find({channelId: channelId,type:'admin'},function(err,admins){
                                var adminsId = admins.map(function(item){
                                    return item['userId'];
                                });
                                callback(null,creatorId,adminsId);
                            });
                        },
                        function(creatorId,adminsId,callback){
                            //关注着数量（不包含创建者和管理员）
                            var creator=1;
                            var count = User.count({channelId:channelId,type:'follower'},function(err,count){
                                
                                var pageLength=Math.ceil((count+creator+adminsId.length)/limit);
                                callback(null,creatorId,adminsId,pageLength);
                            });             
                        },
                        function(creatorId,adminsId,pageLength,callback){
                            var creator=1;
                            var followerNum=limit;
                            var minPage;
                            //防止大于翻页上限
                            if(p>pageLength&&pageLength>0) minPage=pageLength;
                            else minPage=p;
                            //防止超过下限
                            if (minPage<1){minPage=1;followerNum=limit-creator-adminsId.length}
                            Channel2User.find({channelId: channelId,type:'follower'}).sort({followerTime:-1}).skip(limit*(minPage-1)-creatorId.length-adminsId.length).limit(followerNum).exec(function (err, followers) {
                                var followersId = followers.map(function(item){
                                    return item['userId'];
                                });
                                callback(null,creatorId,adminsId,pageLength,followersId);
                            });
                        }
                    ],function(err,creatorId,adminsId,pageLength,followersId){
                        if(err) return console.log(err);
                        async.parallel({
                                creator: function(callback){
                                    User.findOne({_id:creatorId},function(err,creator){
                                        if(err) console.log(err);
                                        callback(null,creator);
                                    });
                                },
                                admins: function(callback){
                                    User.find({_id:{$in:adminsId}},function(err,admins){
                                        if(err) console.log(err);
                                        callback(null,admins);
                                    });
                                },
                                 followers: function(callback){
                                     User.find({_id:{$in:followersId}},function(err,followers){
                                         if(err) console.log(err);
                                         callback(null,followers);
                                     });
                                 },
                                 pageLength:function(callback){
                                    callback(null,pageLength);
                                 }
                        },
                        function(err, results) {
                            if(err) console.log(err);
                            callback(null,results);
                        });
                    });
                }else{}
            }
        },
        function(err,results){
            if(!results.channel) return res.redirect('/');
            var channel = results.channel;
            channel.userType = results.userType;
            var users = results.users;
            var page=tool.skipPage(p,results.users.pageLength);console.log(p);
            Package.render('follower', {
                channel:channel,
                users:users,
                page:page
            }, function(err, html) {
                if(err) console.log(err);
                res.send(html);
            });
        });
};

//展示未审核内容
exports.renderCheck = function(req,res,Package){
    var channelId = req.params['channelId'];
    var limit=1;
    var p=req.query.p||1;
    async.waterfall([
            function(callback){
                var type = 'not';
                if(req.user){
                    Channel2User.findOne({channelId: channelId,userId:req.user._id}, function (err, doc) {
                        if (doc) {
                            //console.log(doc);
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
                    callback(null,type,channel);
                });
            },
            function(type,channel,callback){
                Bookmarks.count({channelId:channelId,checked:0},function(err,count){
                    if (err) return console.log(err);
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
                    if(err) console.log(err);
                    if(doc.length === 0) return callback(null,type,channel,pageLength,[]);
                    callback(null,type,channel,pageLength,doc);
                });
            }],
        function(err,type,channel,pageLength,doc){
            if(!channel) return res.redirect('/');
            var channel = channel;
            var list = doc;
            var page=tool.skipPage(p,pageLength);console.log(page);console.log("!!!!!");
            channel.userType = type;
            Package.render('manage', {
                channel:channel,
                list:list,
                page:page
            }, function(err, html) {
                if(err) console.log(err);
                res.send(html);
            });
        });




    // async.parallel({
    //         userType:function(callback){
    //             var type = 'not';
    //             if(req.user){
    //                 Channel2User.findOne({channelId: channelId,userId:req.user._id}, function (err, doc) {
    //                     if (doc) {
    //                         //console.log(doc);
    //                         if (doc.type == 'admin' || doc.type == 'creator') {
    //                             type = 'admin';
    //                         } else if (doc.type == 'follower') {
    //                             type = 'follower';
    //                         }
    //                     }
    //                     callback(null,type);
    //                 });
    //             }else{
    //                 callback(null,type);
    //             }
    //         },
    //         channel:function (callback) {
    //             Channels.findOne({_id: channelId}, function (err, channel) {
    //                 callback(null,channel);
    //             });
    //         },
    //         list:function(callback){
    //             Bookmarks.find({channelId:channelId,checked:0}).sort({postTime:-1}).limit(10).exec(function (err, doc) {
    //                 if(err) console.log(err);
    //                 if(doc.length === 0) return callback(null,[]);
    //                 callback(null,doc);
    //             });
    //         }
    //     },
    //     function(err,results){
    //         if(!results.channel) return res.redirect('/');
    //         var channel = results.channel;
    //         var list = results.list;
    //         channel.userType = results.userType;
    //         Package.render('manage', {
    //             channel:channel,
    //             list:list
    //         }, function(err, html) {
    //             if(err) console.log(err);
    //             res.send(html);
    //         });
    //     });

};

//更新频道信息
exports.update = function(req,res){
    var channelId = req.params['channelId'];
    var update = {};
    if(req.body.name)  update.name = req.body.name;
    if(req.body.logo)  update.logo = req.body.logo;
    if(req.body.description) update.description = req.body.description;
    if(req.body.type) update.type  = req.body.type;
    if(req.body.tags) update.tags = req.body.tags;

    Channels.update({_id:channelId},update,function(err,doc){
        if(err) return console.log(err);
        res.status(200).send({success:true,info:'修改信息成功'});

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