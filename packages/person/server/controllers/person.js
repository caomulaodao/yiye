/**
 * Created by laodao on 14/11/21.
 */

var mongoose = require('mongoose'),
    async = require('async'),
    moment = require('moment'),
    tool=require('../../../../config/tools/tool');
    User = mongoose.model('User'),
    Bookmarks = mongoose.model('Bookmarks'),
    Channels = mongoose.model('Channels'),
    Channel2User = mongoose.model('Channel2User'),
    BookmarkLike = mongoose.model('BookmarkLike'),
    BookmarkHate = mongoose.model('BookmarkHate');


//展示用户提交的书签
exports.renderPost = function(req,res,Package){
    var userId = req.params['userId'];
    var p=req.query.p||1;
    var limit=1;//每页显示的数量
    async.parallel({
            user:function (callback) {
                User.findOne({_id:userId}, function (err, user) {
                    callback(null,user);
                });
            },
            list:function(callback){
                Bookmarks.find({checked:6,"postUser.userId":req.user._id}).sort({postTime:-1}).skip(limit*(p-1)).limit(limit).exec(function (err, doc) {
                    if(err) console.log(err);
                    if(doc.length === 0) return callback(null,[]);
                    callback(null,listToArray(doc));
                });
            },
            count:function(callback){
                Bookmarks.count({checked:6,'postUser.userId':req.user._id},function(err,count){
                    if(err) return console.log(err);
                    callback(err,count)
                })
            }
        },
        function(err,results){
            var user = results.user;
            var list = results.list;
            var count=results.count,pageLength=Math.ceil(count/limit);
            var page=tool.skipPage(p,pageLength);
            Package.render('index', {
                user:user,
                list:list,
                page:page
            }, function(err, html) {
                if(err) console.log(err);
                res.send(html);
            });
        });
}

//展示用户创建的的频道
exports.renderCreate = function(req,res,Package){
    var userId = req.params['userId'];
    async.parallel({
            user:function (callback) {
                User.findOne({_id:userId}, function (err, user) {
                    callback(null,user);
                });
            },
            list:function(callback){
                Channels.find({"creator.userId":userId}).sort({time:-1}).limit(10).exec(function (err, doc) {
                    if(err) console.log(err);
                    if(doc.length === 0) return callback(null,[]);
                    callback(null,doc);
                });
            }
        },
        function(err,results){
            var user = results.user;
            var list = results.list;
            Package.render('create', {
                user:user,
                list:list
            }, function(err, html) {
                if(err) console.log(err);
                res.send(html);
            });
        });
}

//展示用户关注的频道
exports.renderWatch = function(req,res,Package){
    var userId = req.params['userId'];
    async.parallel({
            user:function (callback) {
                User.findOne({_id:userId}, function (err, user) {
                    callback(null,user);
                });
            },
            list:function(callback){
                Channel2User.find({userId:userId},{ _id: 0, channelId: 1 },function(err,doc){
                    if(err) console.log(err);
                    var channelIds = []
                    doc.forEach(function(item){
                        channelIds.push(item.channelId);
                    });
                    Channels.find({_id:{$in:channelIds}}).sort({time:-1}).limit(10).exec(function (err, doc) {
                        if(err) console.log(err);
                        if(doc.length === 0) return callback(null,[]);
                        callback(null,doc);
                    });
                });
            }
        },
        function(err,results){
            var user = results.user;
            var list = results.list;
            Package.render('watch', {
                user:user,
                list:list
            }, function(err, html) {
                if(err) console.log(err);
                res.send(html);
            });
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