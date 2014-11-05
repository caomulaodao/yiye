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
    var array = str.split(/[,，]/);
    array.forEach(function(item){
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
    Bookmarks = mongoose.model('Bookmarks'),
    Channels = mongoose.model('Channels'),
    Channel2User = mongoose.model('Channel2User'),
    BookmarkLike = mongoose.model('BookmarkLike'),
    BookmarkHate = mongoose.model('BookmarkHate');


exports.receive = function(req,res){
    if(!(req.body.channels instanceof Array) || !(req.body.channels.length > 0))
        return res.status(400).send({info:"提交频道不能为空"});
    var bookmarks = req.body;
    bookmarks.tags = getTags(bookmarks.tags);
    var channels = req.body.channels.unique();
    bookmarks.channels = undefined;
    channels.forEach(function(item){
        var bookmark = Bookmarks(bookmarks);
        bookmark.channelId = item;
        bookmark.postUser = {userId:req.user._id,username:req.user.username};
        bookmark.save(function(err){
            if(err) console.log(err);
            Channels.update({_id:item},{$inc:{bmkNum:1}},{},function(err,doc){
                if(err) console.log(err);
            });
        });
    });
    //返回频道信息
    Channel2User.find({userId:req.user._id,channelId:{$in:channels}},'channelId name logo type',function(err,channels){
        if(err) return res.send({info:"err"});
        return res.json(channels);
    });
}

exports.init  =  function(req,res){
    if(!req.user) return res.status(401).json({info:'请先注册或登录'});
    var channelId = req.params['channelId'];
    async.parallel({
        info: function(callback){
            Channels.findOne({_id:channelId},function(err,doc){
                if(err) console.log(err);
                callback(null,doc);
            });
        },
        list: function(callback){
            //
            Bookmarks.find({channelId:channelId}).sort({postTime:-1}).limit(100).exec(function (err, doc) {
                if(err) console.log(err);
                if(doc.length === 0) return callback(null,[]);
                var lastTime = doc[0]['postTime'];
                var targetTime = doc[doc.length -1]['postTime'];
                if(!moment(lastTime).isSame(targetTime, 'day')){
                    var startDay = moment(doc[doc.length -1]['postTime']).startOf('day').toDate();
                    Bookmarks.find({channelId:channelId,postTime:{$gte:startDay}}).sort({postTime:-1}).exec(function(err,list){
                        if(err) console.log(err);
                        callback(null,listToArray(list));
                    });
                }else{
                    var lastDay = moment(doc[0]['postTime']).startOf('day').toDate();
                    Bookmarks.find({channelId:channelId,postTime:{$gte:lastDay}}).sort({postTime:-1}).exec(function(err,list){
                        if(err) console.log(err);
                        callback(null,listToArray(list));
                    });
                }
            })
        }
    },function(err,results){
        //更新频道最后访问时间并返回数据
        Channel2User.update({channelId:channelId,userId:req.user._id},{lastTime:Date.now()},function(err){
            if(err) return console.log(err);
            res.json(results);
        });
    });

}

//对某个书签点赞
exports.like = function(req,res){
    var bookmarkId = req.params['bookmarkId'];
    BookmarkHate.remove({bookmarkId:bookmarkId,userId:req.user._id},function(err,doc){
        if(err) return console.log(err);
        if(doc > 0){
            Bookmarks.update({_id:bookmarkId},{$inc:{hateNum:-1}},function(err,doc){
                if(err) console.log(err);
            });
        }
    });
    BookmarkLike.find({bookmarkId:bookmarkId,userId:req.user._id},function(err,doc){
        if(err) return console.log(err);
        if(doc.length > 0){
           return res.json({err:true,info:"已经点赞"})
        }else{
            var like = BookmarkLike({});
            like.bookmarkId = bookmarkId;
            like.userId = req.user._id;
            like.username = req.user.username;
            like.save(function(err){
                if(err) return console.log(err);
                Bookmarks.update({_id:bookmarkId},{$inc:{likeNum:1}},function(err,doc){
                    if(err) console.log(err);
                });
                return res.json({success:true,info:"已经点赞"})
            });
        }
    });
}

//对某个书签反对
exports.hate = function(req,res){
    var bookmarkId = req.params['bookmarkId'];
    BookmarkLike.remove({bookmarkId:bookmarkId,userId:req.user._id},function(err,doc){
        if(err) return console.log(err);
        console.log('-------------');
        console.log(doc);
        if(doc > 0){
            Bookmarks.update({_id:bookmarkId},{$inc:{likeNum:-1}},function(err,doc){
                if(err) console.log(err);
            });
        }
    });
    BookmarkHate.find({bookmarkId:bookmarkId,userId:req.user._id},function(err,doc){
        if(err) return console.log(err);
        if(doc.length > 0){
            return res.json({err:true,info:"已经反对"})
        }else{
            var hate = BookmarkHate({});
            hate.bookmarkId = bookmarkId;
            hate.userId = req.user._id;
            hate.username = req.user.username;
            hate.save(function(err){
                if(err) return console.log(err);
                Bookmarks.update({_id:bookmarkId},{$inc:{hateNum:1}},function(err,doc){
                    if(err) console.log(err);
                });
                return res.json({success:true,info:"已经反对"})
            });
        }
    });

}

//获取某天的书签
exports.oneDay = function(req,res){
    if(!req.user) return res.status(401).json({info:'请先注册或登录'});
    var channelId = req.params['channelId'];
    var day = req.body['day'];
    //如果没有获取到天数，则默认为最接近的一天
    if(!day){
        async.waterfall([
            function(callback){
                Bookmarks.find({channelId:channelId}).sort({postTime:-1}).limit(1).exec(function (err, doc) {
                    if(err) return console.log(err);
                    var day =  moment(doc[0]['postTime']).startOf('day').toDate();
                    callback(null,day);
                });
            },
            function(day,callback){
                Bookmarks.find({channelId:channelId,postTime:{$lt:day}}).sort({postTime:-1}).limit(1).exec(function (err, doc) {
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
            var dayResult = {};
            dayResult.day = results.day;
            dayResult.nextDay = results.nextDay;
            var startDay = moment(day,"YYYY-MM-DD").startOf('day').toDate();
            var endDay = moment().add('days',1).toDate();
            Bookmarks.find({channelId:channelId,postTime:{$gte:startDay,$lt:endDay}}).sort({postTime:-1}).exec(function(err,list){
                if(err) console.log(err);
                list.sort(function(a,b){
                    var aRank = a['likeNum'] - a['hateNum'];
                    var bRank = b['likeNum'] - b['hateNum'];
                    return aRank > bRank ? -1 : 1;
                });
                dayResult.list = list
                res.json(dayResult);
            });
        });
    }else{
        var startDay = moment(day,"YYYY-MM-DD").startOf('day').toDate();
        var endDay = moment(day,"YYYY-MM-DD").add('days',1).toDate();
        Bookmarks.find({channelId:channelId,postTime:{$lt:startDay}}).sort({postTime:-1}).limit(1).exec(function (err, doc) {
            if(err) return console.log(err);
            if(doc.length == 0){
                var nextDay = null;
            }else{
                var nextDay =  moment(doc[0]['postTime']).startOf('day').toDate();
            }
            var dayResult = {};
            dayResult.day = day;
            dayResult.nextDay = nextDay;
            Bookmarks.find({channelId:channelId,postTime:{$gte:startDay,$lt:endDay}}).sort({postTime:-1}).exec(function(err,list){
                if(err) console.log(err);
                list.sort(function(a,b){
                    var aRank = a['likeNum'] - a['hateNum'];
                    var bRank = b['likeNum'] - b['hateNum'];
                    return aRank > bRank ? -1 : 1;
                });
                dayResult.list = list
                res.json(dayResult);
            });
        });
    }

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