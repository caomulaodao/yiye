/**
 * Created by laodao on 14-9-30.
 */

//重写Array对象
Array.prototype.unique = function(){
    this.sort(); //先排序
    var res = [this[0]];
    for(var i = 1; i < this.length; i++){
        if(this[i] !== res[res.length - 1]){
            res.push(this[i]);
        }
    }
    return res;
}

//从字符串获取tags
function getTags(str){
    if(!str) return [];
    str = str.toString();
    var tags = [];
    var array = str.split(/[,，\s]/);
    array.forEach(function(item){
        item = xss(item,{whiteList:{}});//标签xss过滤
        newItem = item.trim();
        if(newItem !== ''){
            tags.push(newItem);
        }
    });
    tags = tags.unique();
    return tags;
}

var mongoose = require('mongoose'),
    async = require('async'),
    moment = require('moment'),
    xss =require('xss'),
    verify =require('../../../../config/tools/verify')
    User = mongoose.model('User'),
    Bookmarks = mongoose.model('Bookmarks'),
    Channels = mongoose.model('Channels'),
    Channel2User = mongoose.model('Channel2User'),
    BookmarkLike = mongoose.model('BookmarkLike'),
    BookmarkHate = mongoose.model('BookmarkHate');
//接受新提交的书签
exports.receive = function(req,res){
    if(!req.user) return res.sendResult('请先注册或登录',1000,null);
    var titleLength=100,descriptionLength=200;//限制长度
    if(req.body.tags==null) req.body.tags='';
    if(req.body.title==null){return res.sendResult('标题不能为空',3001,null);}
    if(req.body.description==null){return res.sendResult('描述不能为空',3002,null);}
    if(req.body.url==null){return res.sendResult('书签地址不能为空',3003,null);}
    if(req.body.image==null){return res.sendResult('图片不能为空',3004,null);}
    if(req.body.channels==null||(!verify.isArray(req.body.channels)&&req.body.channels.length==0)){return res.sendResult('提交频道不能为空',3006,null);}
    if(!(
        verify.isString(req.body.title)&&verify.isString(req.body.description)&&verify.isString(req.body.url)
        &&verify.isString(req.body.image)&&verify.isString(req.body.tags)&&verify.isArray(req.body.channels)
        )){ return res.sendResult('参数类型错误',2000,null)};//判断数据格式
    if (!verify.isUrl(req.body.url)){return res.sendResult('url格式错误',2010,null);}
    var bookmarks ={
        title:xss(req.body.title,{whiteList:{}}),
        description:xss(req.body.description,{whiteList:{}}),
        url:encodeURI(xss(req.body.url,{whiteList:{}})),
        image:xss(req.body.image,{whiteList:{}}),
        channels:req.body.channels,
        tags:xss(req.body.tags,{whiteList:{}})
    };
    if(bookmarks.title.length>titleLength){bookmarks.title=bookmarks.title.substr(0,titleLength);}
    if(bookmarks.description.length>descriptionLength){bookmarks.description=bookmarks.description.substr(0,descriptionLength);}
    bookmarks.tags = getTags(bookmarks.tags);
    var channels = req.body.channels.unique();
    for(var i=0;i<channels.length;i++){
        if (!verify.idVerify(channels[i])){
            return res.sendResult('数据格式错误',2001,null)
        }
        channels[i] = xss(channels[i],{whiteList:{}});
    }
    bookmarks.channels = undefined;

    async.parallel([
        function(callback){
            async.map(channels,function(item,callback){
                //查看用户是否是管理员？
                Channel2User.findOne({channelId:item,userId:req.user._id},function(err,doc){
                    if(err) {console.log(err);return res.sendError()}
                    var bookmark = Bookmarks(bookmarks);
                    //向书签中加入所在频道的信息
                    bookmark.channelInfo.channelId = doc.channelId;
                    bookmark.channelInfo.channelName = doc.name;
                    bookmark.channelInfo.channelLogo = doc.logo;
                    var pass = false;
                    //如果是管理员或创始人，则直接审核通过
                    if(doc.type == "creator" || doc.type == "admin"){
                        pass = true;
                        bookmark.checked = 5;
                    }
                    bookmark.channelId = item;
                    bookmark.postUser = {userId:req.user._id,username:req.user.username};
                    bookmark.save(function(err){
                        if(err) {console.log(err);return res.sendError()}
                        if(pass){
                            Channels.update({_id:item},{$inc:{bmkNum:1}},function(err,doc){
                                if(err) {console.log(err);return res.sendError()}
                                callback(null,true);
                            });
                        }else{
                            callback(null,true);
                        }
                    });
                });
            }, function(err, results){
                if(err) {console.log(err);return res.sendError()}
                callback(null,true);
            });
        },
        function(callback){
            // 添加用户自己留底的书签记录
            var bookmark = Bookmarks(bookmarks);
            bookmark.checked = 6;
            bookmark.channelId =  undefined;
            bookmark.postUser = {userId:req.user._id,username:req.user.username};
            bookmark.save(function(err){
                if(err) {console.log(err);return res.sendError()}
                User.update({_id:req.user._id},{$inc:{postNum:1}},function(err,doc){
                    if(err) {console.log(err);return res.sendError()}
                    callback(null,true);
                })
            });
        }
    ]
    ,function(err,results){
        //返回频道信息
        Channel2User.find({userId:req.user._id,channelId:{$in:channels}},'channelId name logo type',function(err,channels){
            if(err) {console.log(err);return res.sendError();}
            return res.sendResult('提交成功!',0,channels);
        });
    });
}
//频道界面添加书签插件的接口
exports.scraperReceive = function(req,res){
    if(!req.user) return res.sendResult('请先注册或登录',1000,null);
    var titleLength=100,descriptionLength=200;//限制长度
    if(req.body.tags==null) req.body.tags='';
    if(req.body.title==null){return res.sendResult('标题不能为空',3001,null);}
    if(req.body.description==null){return res.sendResult('描述不能为空',3002,null);}
    if(req.body.website==null){return res.sendResult('书签地址不能为空',3003,null);}
    if(req.body.image==null){return res.sendResult('图片不能为空',3004,null);}
    if(req.body.channel==null||(!verify.idVerify(req.body.channel))){return res.sendResult('频道ID格式错误',3006,null);}
    if(!(
        verify.isString(req.body.title)&&verify.isString(req.body.description)&&verify.isString(req.body.website)
        &&verify.isString(req.body.image)&&verify.isString(req.body.tags)
        )){ return res.sendResult('参数类型错误',2000,null)};//判断数据格式
    if (!verify.isUrl(req.body.website)){return res.sendResult('url格式错误',2010,null);}
    var bookmarks ={
        title:xss(req.body.title,{whiteList:{}}),
        description:xss(req.body.description,{whiteList:{}}),
        url:encodeURI(xss(req.body.website,{whiteList:{}})),
        image:xss(req.body.image,{whiteList:{}}),
        channels:req.body.channel,
        tags:xss(req.body.tags,{whiteList:{}})
    };
    if(bookmarks.title.length>titleLength){bookmarks.title=bookmarks.title.substr(0,titleLength);}
    if(bookmarks.description.length>descriptionLength){bookmarks.description=bookmarks.description.substr(0,descriptionLength);}
    bookmarks.tags = getTags(bookmarks.tags);
    var channels = [];
    channels[0] =req.body.channel;
    bookmarks.channels = undefined;

    async.parallel([
        function(callback){
            async.map(channels,function(item,callback){
                //查看用户是否是管理员？
                Channel2User.findOne({channelId:item,userId:req.user._id},function(err,doc){
                    if(err) {console.log(err);return res.sendError()}
                    var bookmark = Bookmarks(bookmarks);
                    //向书签中加入所在频道的信息
                    bookmark.channelInfo.channelId = doc.channelId;
                    bookmark.channelInfo.channelName = doc.name;
                    bookmark.channelInfo.channelLogo = doc.logo;
                    var pass = false;
                    //如果是管理员或创始人，则直接审核通过
                    if(doc.type == "creator" || doc.type == "admin"){
                        pass = true;
                        bookmark.checked = 5;
                    }
                    bookmark.channelId = item;
                    bookmark.postUser = {userId:req.user._id,username:req.user.username};
                    bookmark.save(function(err){
                        if(err) {console.log(err);return res.sendError()}
                        if(pass){
                            Channels.update({_id:item},{$inc:{bmkNum:1}},function(err,doc){
                                if(err) {console.log(err);return res.sendError()}
                                callback(null,true);
                            });
                        }else{
                            callback(null,true);
                        }
                    });
                });
            }, function(err, results){
                if(err) {console.log(err);return res.sendError()}
                callback(null,true);
            });
        },
        function(callback){
            // 添加用户自己留底的书签记录
            var bookmark = Bookmarks(bookmarks);
            bookmark.checked = 6;
            bookmark.channelId =  undefined;
            bookmark.postUser = {userId:req.user._id,username:req.user.username};
            bookmark.save(function(err){
                if(err) {console.log(err);return res.sendError()}
                User.update({_id:req.user._id},{$inc:{postNum:1}},function(err,doc){
                    if(err) {console.log(err);return res.sendError()}
                    callback(null,true);
                })
            });
        }
    ]
    ,function(err,results){
        //返回频道信息
        Channel2User.find({userId:req.user._id,channelId:{$in:channels}},'channelId name logo type',function(err,channels){
            if(err) {console.log(err);return res.sendError();}
            return res.sendResult('提交成功!',0,channels);
        });
    });
}







//获取频道内的书签
exports.init  =  function(req,res){
    var limit=20;
    if(!req.user) return res.sendResult('请先注册或登录',1000,null);
    var channelId = req.query['channelId'];
    if(!verify.idVerify(channelId)){return res.sendResult('参数类型错误',2000,null)}
    async.parallel({
        info: function(callback){
            Channels.findOne({_id:channelId},function(err,doc){
                if(err) {console.log(err);return res.sendError()}
                callback(null,doc);
            });
        },
        list: function(callback){
            //频道的书签数
            Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]}}).sort({postTime:-1}).limit(limit).exec(function (err, doc) {
                if(err) {console.log(err);return res.sendError()}
                if(doc.length === 0) return callback(null,[]);
                var lastTime = doc[0]['postTime'];
                var targetTime = doc[doc.length -1]['postTime'];
                if(!moment(lastTime).isSame(targetTime, 'day')){
                    var startDay = moment(doc[doc.length -1]['postTime']).startOf('day').toDate();
                    Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]},postTime:{$gte:startDay}}).sort({postTime:-1}).exec(function(err,list){
                        if(err) {console.log(err);return res.sendError()}
                        callback(null,listToArray(list));
                    });
                }else{
                    var lastDay = moment(doc[0]['postTime']).startOf('day').toDate();
                    Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]},postTime:{$gte:lastDay}}).sort({postTime:-1}).exec(function(err,list){
                        if(err) {console.log(err);return res.sendError()}
                        callback(null,listToArray(list));
                    });
                }
            })
        },
        endbookmarkId: function(callback){//数据库中对应频道中最后一条书签的Id
            Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]}}).sort({postTime:1}).limit(1).exec(function(err,list){
                if (err) { console.log(err);return res.sendError()}
                if(list.length===0) return callback(null,null);
                var lastbmId = list[0]['_id'];
                callback(null,lastbmId);
            })
        }
    },function(err,results){
        //更新频道最后访问时间并返回数据
        results.isHave=true;//下次是否进行ajax请求
        results.nextTime=null;//请求加载对应时间的书签
        //数据库里对应频道一条书签也没有的情况
        if (results.endbookmarkId==null) {results.isHave=false;}
        //取出来书签的最后一条的ID和数据库里最后一条ID相等的时候则isHave为false
        else{
            results.nextTime=results.list[results.list.length-1].day;//返回给前端下次请求的书签的时间
            var lastbmId = results.list[results.list.length-1]['_id'];
            if (lastbmId==results.endbookmarkId) {results.isHave=fasle;}
        }
        Channel2User.update({channelId:channelId,userId:req.user._id},{lastTime:Date.now()},function(err){
            if(err) { console.log(err);return res.sendError()}
            res.sendResult('获取书签成功!',0,results);
        });
    }
    )
}

//对某个书签点赞
exports.like = function(req,res){

    if(!req.user) return res.sendResult('请先注册或登录',1000,null);
    var bookmarkId = req.body['bookmarkId'];
    if(!verify.idVerify(bookmarkId)){return res.sendResult('参数类型错误',2000,null)}
    async.parallel({
        isHated:function(callback){
            BookmarkHate.remove({bookmarkId: bookmarkId, userId: req.user._id}, function (err, doc) {
                if (err) {console.log(err);return res.sendError()}
                if (doc > 0) {
                    Bookmarks.update({_id: bookmarkId}, {$inc: {hateNum: -1}}, function (err, doc) {
                        if (err) {console.log(err);return res.sendError()}
                        callback(null, true);
                    });
                } else {
                    callback(null, false);
                }
            });
        },
        isLiked:function (callback) {
            BookmarkLike.find({bookmarkId: bookmarkId, userId: req.user._id}, function (err, doc) {
                if (err) { console.log(err);return res.sendError()}
                if (doc.length > 0) {
                    callback(null, true);
                }else{
                    //查询获取bookmarkId
                    Bookmarks.findOne({_id: bookmarkId}, function (err, bookmark) {
                        if (err) {console.log(err);return res.sendError()}
                        var like = BookmarkLike({});
                        like.bookmarkId = bookmarkId;
                        like.userId = req.user._id;
                        like.username = req.user.username;
                        like.channelId = bookmark.channelId;
                        like.channelName = bookmark.channelInfo.channelName,
                        like.bookmarkLogo = bookmark.image,
                        like.bookmarkName = bookmark.title,
                        like.userLogo = req.user.avatar,
                        //保存点赞数据
                        like.save(function (err) {
                            if (err) {console.log(err);return res.sendError()}
                            //更新书签数据
                            Bookmarks.update({_id: bookmarkId}, {$inc: {likeNum: 1}}, function (err, doc) {
                                if (err) {console.log(err);return res.sendError()}
                                callback(null,false);
                            });
                        });
                    });

                }
            });
        }
    },function(err,results){
        if(err) {console.log(err);return res.sendError()}
        return res.sendResult('已经点赞',0,results);
    });
}

//对某个书签反对
exports.hate = function(req,res){

    if(!req.user) return res.sendResult('请先注册或登录',1000,null);
    var bookmarkId = req.body['bookmarkId'];
    if(!verify.idVerify(bookmarkId)){return res.sendResult('参数类型错误',2000,null)}
    async.parallel({
        isLiked:function(callback){
            BookmarkLike.remove({bookmarkId:bookmarkId,userId:req.user._id},function(err,doc){
                if(err) { console.log(err);return res.sendError()}
                if(doc > 0){
                    Bookmarks.update({_id:bookmarkId},{$inc:{likeNum:-1}},function(err,doc){
                        if(err) {console.log(err);return res.sendError()}
                        callback(null,true);
                    });
                }else{
                    callback(null,false);
                }
            });
        },
        isHated:function(callback){
            BookmarkHate.find({bookmarkId:bookmarkId,userId:req.user._id},function(err,doc){
                if(err)  {console.log(err);return res.sendError()}
                if(doc.length > 0){
                    callback(null,true);
                }else{
                    Bookmarks.find({_id: bookmarkId}, function (err, bookmark) {
                        var hate = BookmarkHate({});
                        hate.bookmarkId = bookmarkId;
                        hate.userId = req.user._id;
                        hate.username = req.user.username;
                        hate.channelId = bookmark.channelId;
                        hate.save(function(err){
                            if(err) {console.log(err);return res.sendError()}
                            Bookmarks.update({_id:bookmarkId},{$inc:{hateNum:1}},function(err,doc){
                                if(err) {console.log(err);return res.sendError()}
                                callback(null,false);
                            });
                        });
                    });
                }
            });
        }
    },function(err,results){
        if(err) {console.log(err);return res.sendError()}
        return res.sendResult("已经反对",0,results);
    });
}

//获取某天的书签
exports.oneDay = function(req,res){
    var channelId = req.query['channelId'];
    if(!verify.idVerify(channelId)){return res.sendResult('参数格式错误',2001,null)}
    var day = req.query['date'];
    if (!day) {day=""}
    if (!verify.isString(day)) {return res.sendResult('参数类型错误',2000,null)}
    var limit=20;
    //如果没有获取到天数，则默认为最接近的一天  修改bug1(增加频道不存在书签的情况)
    if(!day){
        async.waterfall([
            function(callback){
                Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]}}).sort({postTime:-1}).limit(limit).exec(function (err, doc) {
                    if(err) {console.log(err);return res.sendError()}
                    if(doc.length == 0){
                        var day = null;
                    }else{
                        var day =  moment(doc[0]['postTime']).startOf('day').toDate();
                    }
                    callback(null,day);
                });
            },
            function(day,callback){
                if(!day) return callback(null,{day:null,nextDay:null});
                Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]},postTime:{$lt:day}}).sort({postTime:-1}).limit(limit).exec(function (err, doc) {
                    if(err) {console.log(err);return res.sendError()}
                    if(doc.length == 0){
                        var nextDay = null;
                    }else{
                        var nextDay =  moment(doc[0]['postTime']).startOf('day').toDate();
                    }
                    callback(null,{day:day,nextDay:nextDay});
                });
            }
        ],function(err,results){
            if(!results.day) return res.sendResult('获取书签成功',0,{day:null,nextDay:null,list:[]});
            var dayResult = {};
            // dayResult.date = results.day;
            // dayResult.nextDay = results.nextDay;
            var startDay = moment(day,"YYYY-MM-DD").startOf('day').toDate();
            var endDay = moment().add('days',1).toDate();
            Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]},postTime:{$gte:startDay,$lt:endDay}}).sort({postTime:-1}).exec(function(err,list){
                if(err) console.log(err);
                list.sort(function(a,b){
                    var aRank = a['likeNum'] - a['hateNum'];
                    var bRank = b['likeNum'] - b['hateNum'];
                    return aRank > bRank ? -1 : 1;
                });
                // dayResult.list = list;
                dayResult = list;
                res.sendResult('获取书签成功',0,dayResult);
            });
        });
    }else{
        var startDay = moment(day,"YYYY-MM-DD").startOf('day').toDate();
        var endDay = moment(day,"YYYY-MM-DD").add('days',1).toDate();
        Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]},postTime:{$lt:startDay}}).sort({postTime:-1}).limit(1).exec(function (err, doc) {
            if(err) {console.log(err);return res.sendError()}
            if(doc.length == 0){
                var nextDay = null;
            }else{
                var nextDay =  moment(doc[0]['postTime']).startOf('day').toDate();
            }
            var dayResult = {};
            // dayResult.date = day;
            // dayResult.nextDay = nextDay;
            Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]},postTime:{$gte:startDay,$lt:endDay}}).sort({postTime:-1}).exec(function(err,list){
                if(err) {console.log(err);return res.sendError()}
                list.sort(function(a,b){
                    var aRank = a['likeNum'] - a['hateNum'];
                    var bRank = b['likeNum'] - b['hateNum'];
                    return aRank > bRank ? -1 : 1;
                });
                // dayResult.list = list;
                dayResult = list;
                res.sendResult('获取书签成功',0,dayResult);
            });
        });
    }

}

//审核通过某个书签
exports.pass = function(req,res){
    if(!req.user) return res.sendResult('请先注册或登录',1000,null);
    var channelId = req.params['channelId'];
    var bookmarkId = req.params['bookmarkId'];
    if(!verify.idVerify(channelId)||!verify.idVerify(bookmarkId)){return res.sendResult('参数类型错误',2000,null)}
    Channel2User.findOne({channelId:channelId,userId:req.user._id,type:{$in:['creator','admin']}},function(err,doc){
        if (err){console.log(err);return res.sendError()}
        if(doc){
            var checkUser = {userId:req.user._id,username:req.user.username,avatar:req.user.avatar};
            Bookmarks.update({_id:bookmarkId},{checked:1,checkUser:checkUser},function(err,doc){
                if(err) {console.log(err);return res.sendError()}
                res.sendResult('书签已通过',0,null);
            });
        }else
        {
            return res.sendResult('你不是该频道管理员',3000,null);
        }
    });
}

//编辑并通过某个书签
exports.edit = function(req,res){
    if(!req.user) return res.sendResult('请先注册或登录',1000,null);
    var channelId = req.params['channelId'];
    var bookmarkId = req.params['bookmarkId'];
    var title = xss(req.body.title,{whiteList:{}});
    var description = xss(req.body.description,{whiteList:{}})
    if (title==null){return res.sendResult('标题不能为空',2007,null)}
    if (description==null) {res.sendResult('描述不能为空',2008,null)}
    if(!verify.idVerify(channelId)||!verify.idVerify(bookmarkId)||!verify.isString(title)||!verify.isString(description)) {return res.sendResult('参数类型错误',2000,null)}
    Channel2User.findOne({channelId:channelId,userId:req.user._id,type:{$in:['creator','admin']}},function(err,doc){
        if(doc){
            var checkUser = {userId:req.user._id,username:req.user.username,avatar:req.user.avatar};
            if(title && description){
                Bookmarks.update({_id:bookmarkId},{checked:1,title:title,description:description,checkUser:checkUser},function(err,doc){
                    if(err) {console.log(err);return res.sendError()}
                    res.sendResult('书签编辑并通过',0,null);
                });
            }else{
                Bookmarks.update({_id:bookmarkId},{checked:1,checkUser:checkUser},function(err,doc){
                    if(err) {console.log(err);return res.sendError()}
                    res.sendResult('书签编辑并通过',0,null);
                });
            }

        }else
        {
            return res.sendResult('你不是该频道管理员',3000,null);
        }
    });
}

//筛除某个书签
exports.delete = function(req,res){
    if(!req.user) return res.sendResult('请先注册或登录',1000,null);
    var channelId = req.params['channelId'];
    var bookmarkId = req.params['bookmarkId'];
    var reason = xss(req.body.reason,{whiteList:{}});
    if (reason==null) reason='';
    if(!verify.idVerify(channelId)||!verify.idVerify(bookmarkId)||!verify.isString(reason)) {return res.sendResult('参数类型错误',2000,null)}
    Channel2User.findOne({channelId:channelId,userId:req.user._id,type:{$in:['creator','admin']}},function(err,doc){
        if(doc){
            var checkUser = {userId:req.user._id,username:req.user.username,avatar:req.user.avatar};
            Bookmarks.update({_id:bookmarkId},{checked:2,deleteInfo:reason,checkUser:checkUser},function(err,doc){
                if(err) {console.log(err);return res.sendError()}
                res.sendResult('书签已经被筛除',0,null);
            });
        }else
        {
            return res.sendResult('你不是该频道管理员',3000,null);
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