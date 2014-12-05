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
    if(!req.user) return res.status(401).json({info:'请先注册或登录'});
    var titleLength=100,descriptionLength=200;//限制长度
    if(!(
        verify.isString(req.body.title)&&verify.isString(req.body.description)&&verify.isString(req.body.url)
        &&verify.isString(req.body.image)&&verify.isString(req.body.tags)&&verify.isArray(req.body.channels)
        )){ return res.status(401),json({info:'数据格式不对'})};//判断数据格式
    if(!(req.body.channels instanceof Array) || !(req.body.channels.length > 0))
        return res.status(401).send({info:"提交频道不能为空"});
    var bookmarks ={
        title:xss(req.body.title,{whiteList:{}}),
        description:xss(req.body.description,{whiteList:{}}),
        url:escape(xss(req.body.url,{whiteList:{}})),
        image:xss(req.body.image,{whiteList:{}}),
        channels:req.body.channels,
        tags:xss(req.body.tags,{whiteList:{}})
    };console.log(bookmarks.title.length);
    if(bookmarks.title.length>titleLength){bookmarks.title=bookmarks.title.substr(0,titleLength);}
    if(bookmarks.description.length>descriptionLength){bookmarks.description=bookmarks.description.substr(0,descriptionLength);}
    bookmarks.tags = getTags(bookmarks.tags);
    var channels = req.body.channels.unique();
    for(var i=0;i<channels.length;i++){
        if (!verify.idVerify(channels[i])){
            return res.status(401).json({info:'数据格式不对'})
        }
        channels[i] = xss(channels[i],{whiteList:{}});
    }
    bookmarks.channels = undefined;

    async.parallel([
        function(callback){
            async.map(channels,function(item,callback){
                //查看用户是否是管理员？
                Channel2User.findOne({channelId:item,userId:req.user._id},function(err,doc){
                    if(err) console.log(err);
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
                        if(err) console.log(err);
                        if(pass){
                            Channels.update({_id:item},{$inc:{bmkNum:1}},function(err,doc){
                                if(err) console.log(err);
                                callback(null,true);
                            });
                        }else{
                            callback(null,true);
                        }
                    });
                });
            }, function(err, results){
                if(err) console.log(err);
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
                if(err) console.log(err);
                User.update({_id:req.user._id},{$inc:{postNum:1}},function(err,doc){
                    if(err) console.log(err);
                    callback(null,true);
                })
            });
        }
    ]
    ,function(err,results){
        //返回频道信息
        Channel2User.find({userId:req.user._id,channelId:{$in:channels}},'channelId name logo type',function(err,channels){
            if(err) return res.send({info:"err"});
            return res.json(channels);
        });
    });



}
//初始化获取书签
exports.init  =  function(req,res){
    var limit=20;
    if(!req.user) return res.status(401).json({info:'请先注册或登录'});
    var channelId = req.query['channelId'];
    if(!verify.idVerify(channelId)){return res.status(401).json({info:'参数错误'})}
    async.parallel({
        info: function(callback){
            Channels.findOne({_id:channelId},function(err,doc){
                if(err) console.log(err);
                callback(null,doc);
            });
        },
        list: function(callback){
            //频道的书签数
            Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]}}).sort({postTime:-1}).limit(limit).exec(function (err, doc) {
                if(err) console.log(err);
                if(doc.length === 0) return callback(null,[]);
                var lastTime = doc[0]['postTime'];
                var targetTime = doc[doc.length -1]['postTime'];
                if(!moment(lastTime).isSame(targetTime, 'day')){
                    var startDay = moment(doc[doc.length -1]['postTime']).startOf('day').toDate();
                    Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]},postTime:{$gte:startDay}}).sort({postTime:-1}).exec(function(err,list){
                        if(err) console.log(err);
                        callback(null,listToArray(list));
                    });
                }else{
                    var lastDay = moment(doc[0]['postTime']).startOf('day').toDate();
                    Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]},postTime:{$gte:lastDay}}).sort({postTime:-1}).exec(function(err,list){
                        if(err) console.log(err);
                        callback(null,listToArray(list));
                    });
                }
            })
        },
        endbookmarkId: function(callback){//数据库中对应频道中最后一条书签的Id
            Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]}}).sort({postTime:1}).limit(1).exec(function(err,list){
                if (err) return console.log(err);
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
            if(err) return console.log(err);
            console.log(results);console.log('啦啦');
            res.json(results);
        });
    }
    )
}

//对某个书签点赞
exports.like = function(req,res){

    if(!req.user) return res.status(401).json({info:'请先注册或登录'});
    var bookmarkId = req.params['bookmarkId'];
    if(!verify.idVerify(bookmarkId)){return res.status(401).json({info:'参数错误'})}
    async.parallel({
        isHated:function(callback){
            BookmarkHate.remove({bookmarkId: bookmarkId, userId: req.user._id}, function (err, doc) {
                if (err) return console.log(err);
                if (doc > 0) {
                    Bookmarks.update({_id: bookmarkId}, {$inc: {hateNum: -1}}, function (err, doc) {
                        if (err) console.log(err);
                        callback(null, true);
                    });
                } else {
                    callback(null, false);
                }
            });
        },
        isLiked:function (callback) {
            BookmarkLike.find({bookmarkId: bookmarkId, userId: req.user._id}, function (err, doc) {
                if (err) return console.log(err);
                if (doc.length > 0) {
                    callback(null, true);
                }else{
                    var like = BookmarkLike({});
                    like.bookmarkId = bookmarkId;
                    like.userId = req.user._id;
                    like.username = req.user.username;
                    like.save(function (err) {
                        if (err) return console.log(err);
                        Bookmarks.update({_id: bookmarkId}, {$inc: {likeNum: 1}}, function (err, doc) {
                            if (err) console.log(err);
                            callback(null,false);
                        });
                    });
                }
            });
        }
    },function(err,results){
        if(err) console.log(err);
        return res.json({success:true,info:"已经点赞",results:results});
    });
}

//对某个书签反对
exports.hate = function(req,res){

    if(!req.user) return res.status(401).json({info:'请先注册或登录'});

    var bookmarkId = req.params['bookmarkId'];
    if(!verify.idVerify(bookmarkId)){return res.status(401).json({info:'参数错误'})}
    async.parallel({
        isLiked:function(callback){
            BookmarkLike.remove({bookmarkId:bookmarkId,userId:req.user._id},function(err,doc){
                if(err) return console.log(err);
                if(doc > 0){
                    Bookmarks.update({_id:bookmarkId},{$inc:{likeNum:-1}},function(err,doc){
                        if(err) console.log(err);
                        callback(null,true);
                    });
                }else{
                    callback(null,false);
                }
            });
        },
        isHated:function(callback){
            BookmarkHate.find({bookmarkId:bookmarkId,userId:req.user._id},function(err,doc){
                if(err) return console.log(err);
                if(doc.length > 0){
                    callback(null,true);
                }else{
                    var hate = BookmarkHate({});
                    hate.bookmarkId = bookmarkId;
                    hate.userId = req.user._id;
                    hate.username = req.user.username;
                    hate.save(function(err){
                        if(err) return console.log(err);
                        Bookmarks.update({_id:bookmarkId},{$inc:{hateNum:1}},function(err,doc){
                            if(err) console.log(err);
                            callback(null,false);
                        });
                    });
                }
            });
        }
    },function(err,results){
        if(err) console.log(err);
        return res.json({success:true,info:"已经反对",results:results});
    });
}

//获取某天的书签
exports.oneDay = function(req,res){
    var channelId = req.params['channelId'];
    if(!verify.idVerify(channelId)){return res.status(401).json({info:'参数错误'})}
    var day = req.body['day'];
    if (!verify.isString(day)) {return res.status(401).json({info:'参数错误'})}
    var limit=20;
    //如果没有获取到天数，则默认为最接近的一天  修改bug1(增加频道不存在书签的情况)
    if(!day){
        async.waterfall([
            function(callback){
                Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]}}).sort({postTime:-1}).limit(limit).exec(function (err, doc) {
                    if(err) return console.log(err);
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
                    if(err) return console.log(err);
                    if(doc.length == 0){
                        var nextDay = null;
                    }else{
                        var nextDay =  moment(doc[0]['postTime']).startOf('day').toDate();
                    }
                    callback(null,{day:day,nextDay:nextDay});
                });
            }
        ],function(err,results){
            if(!results.day) return res.json({day:null,nextDay:null,list:[]});
            var dayResult = {};
            dayResult.day = results.day;
            dayResult.nextDay = results.nextDay;
            var startDay = moment(day,"YYYY-MM-DD").startOf('day').toDate();
            var endDay = moment().add('days',1).toDate();
            Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]},postTime:{$gte:startDay,$lt:endDay}}).sort({postTime:-1}).exec(function(err,list){
                if(err) console.log(err);
                list.sort(function(a,b){
                    var aRank = a['likeNum'] - a['hateNum'];
                    var bRank = b['likeNum'] - b['hateNum'];
                    return aRank > bRank ? -1 : 1;
                });
                dayResult.list = list;
                res.json(dayResult);
            });
        });
    }else{
        var startDay = moment(day,"YYYY-MM-DD").startOf('day').toDate();
        var endDay = moment(day,"YYYY-MM-DD").add('days',1).toDate();
        Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]},postTime:{$lt:startDay}}).sort({postTime:-1}).limit(1).exec(function (err, doc) {
            if(err) return console.log(err);
            if(doc.length == 0){
                var nextDay = null;
            }else{
                var nextDay =  moment(doc[0]['postTime']).startOf('day').toDate();
            }
            var dayResult = {};
            dayResult.day = day;
            dayResult.nextDay = nextDay;
            Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]},postTime:{$gte:startDay,$lt:endDay}}).sort({postTime:-1}).exec(function(err,list){
                if(err) console.log(err);
                list.sort(function(a,b){
                    var aRank = a['likeNum'] - a['hateNum'];
                    var bRank = b['likeNum'] - b['hateNum'];
                    return aRank > bRank ? -1 : 1;
                });
                dayResult.list = list;
                res.json(dayResult);
            });
        });
    }

}

//审核通过某个书签
exports.pass = function(req,res){
    if(!req.user) return res.status(401).json({info:'请先注册或登录'});
    var channelId = req.params['channelId'];
    var bookmarkId = req.params['bookmarkId'];
    if(!verify.idVerify(channelId)||!verify.idVerify(bookmarkId)){return res.status(401).json({info:'参数错误'})}
    Channel2User.findOne({channelId:channelId,userId:req.user._id,type:{$in:['creator','admin']}},function(err,doc){
        if(doc){
            var checkUser = {userId:req.user._id,username:req.user.username,avatar:req.user.avatar};
            Bookmarks.update({_id:bookmarkId},{checked:1,checkUser:checkUser},function(err,doc){
                if(err) return console.log(err);
                res.status(200).json({success:true,info:'书签已通过'});
            });
        }else
        {
            return res.status(401).json({info:'你不是该频道管理员'});
        }
    });
}

//编辑并通过某个书签
exports.edit = function(req,res){
    if(!req.user) return res.status(401).json({info:'请先注册或登录'});
    var channelId = req.params['channelId'];
    var bookmarkId = req.params['bookmarkId'];
    var title = req.body.title;
    var description = req.body.description;
    if(!verify.idVerify(channelId)||!verify.idVerify(bookmarkId)||!verify.isString(title)||!verify.isString(description)) {return res.status(401).json({info:'参数错误'})}
    Channel2User.findOne({channelId:channelId,userId:req.user._id,type:{$in:['creator','admin']}},function(err,doc){
        if(doc){
            var checkUser = {userId:req.user._id,username:req.user.username,avatar:req.user.avatar};
            if(title && description){
                Bookmarks.update({_id:bookmarkId},{checked:1,title:title,description:description,checkUser:checkUser},function(err,doc){
                    if(err) return console.log(err);
                    res.status(200).json({success:true,info:'书签编辑并通过'});
                });
            }else{
                Bookmarks.update({_id:bookmarkId},{checked:1,checkUser:checkUser},function(err,doc){
                    if(err) return console.log(err);
                    res.status(200).json({success:true,info:'书签编辑并通过'});
                });
            }

        }else
        {
            return res.status(401).json({info:'你不是该频道管理员'});
        }
    });
}

//筛除某个书签
exports.delete = function(req,res){
    if(!req.user) return res.status(401).json({info:'请先注册或登录'});
    var channelId = req.params['channelId'];
    var bookmarkId = req.params['bookmarkId'];
    var reason = req.body.reason;
    if(!verify.idVerify(channelId)||!verify.idVerify(bookmarkId)||!verify.isString(reason)) {return res.status(401).json({info:'参数错误'})}
    Channel2User.findOne({channelId:channelId,userId:req.user._id,type:{$in:['creator','admin']}},function(err,doc){
        if(doc){
            var checkUser = {userId:req.user._id,username:req.user.username,avatar:req.user.avatar};
            Bookmarks.update({_id:bookmarkId},{checked:2,deleteInfo:reason,checkUser:checkUser},function(err,doc){
                if(err) return console.log(err);
                res.status(200).json({success:true,info:'书签已经被筛除'});
            });
        }else
        {
            return res.status(401).json({info:'你不是该频道管理员'});
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