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
    Channel2User=mongoose.model('Channel2User'),
    Channel2User = mongoose.model('Channel2User'),
    BookmarkLike = mongoose.model('BookmarkLike'),
    BookmarkHate = mongoose.model('BookmarkHate');


//展示用户提交的书签
exports.renderPost = function(req,res,Package){
    var userId = req.params['userId'];
    var p=req.query.p||1;
    var limit=1;//每页显示的数量
    async.waterfall([
                function (callback) {
                User.findOne({_id:userId}, function (err, user) {
                    callback(null,user);
                });},
                function(user,callback){
                Bookmarks.count({checked:6,'postUser.userId':req.user._id},function(err,count){
                    if(err) return console.log(err);
                    var pageLength=Math.ceil(count/limit);
                    callback(err,user,pageLength);
                });},
                function(user,pageLength,callback){
                    var minPage;
                    //防止大于翻页上限
                    if(p>pageLength&&pageLength>0) minPage=pageLength;
                    else minPage=p;
                    //防止超过下限
                    if (minPage<1){minPage=1;}
                Bookmarks.find({checked:6,"postUser.userId":req.user._id}).sort({postTime:-1}).skip(limit*(minPage-1)).limit(limit).exec(function (err, doc) {
                    if(err) console.log(err);
                    if(doc.length === 0) return callback(null,user,pageLength,[]);
                    callback(null,user,pageLength,listToArray(doc));
                });}
                ],
        function(err,user,pageLength,list){
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
    var p=req.query.p||1;
    var limit=1;//每页显示的数量
    async.waterfall([
        function (callback) {
        User.findOne({_id:userId}, function (err, user) {
            callback(null,user);
        });},
        function(user,callback){
        Channels.count({'creator.userId':userId},function(err,count){
            if(err) return console.log(err);
            var pageLength=Math.ceil(count/limit);
            callback(err,user,pageLength);
        });},
        function(user,pageLength,callback){
            var minPage;
            //防止大于翻页上限
            if(p>pageLength&&pageLength>0) minPage=pageLength;
            else minPage=p;
            //防止超过下限
            if (minPage<1){minPage=1;}
            Channels.find({"creator.userId":userId}).sort({postTime:-1}).skip(limit*(minPage-1)).limit(limit).exec(function (err, doc) {
                if(err) console.log(err);
                if(doc.length === 0) return callback(null,user,pageLength,[]);
                callback(null,user,pageLength,doc);
            });},
            function(user,pageLength,doc,callback){
                if (!req.user) return callback(null,user,pageLength,doc,[]);
                Channel2User.find({'userId':req.user._id},function(err,channel2user){
                    if (err) return console.log(err);
                    var channel2userId=[];
                    channel2user.forEach(function(item){
                        channel2userId.push(item.channelId+'');
                    });console.log(channel2userId);console.log(channel2userId);
                    callback(null,user,pageLength,doc,channel2userId);
                })
            }
        ],
        function(err,user,pageLength,channels,channel2userId){
            var  channels = JSON.parse(JSON.stringify(channels)); 
            channels.forEach(function(item,index,array){               
                if (channel2userId.indexOf(item._id+'')>-1){
                    array[index].isAttention=true;//已经关注
                }
            });
            var page=tool.skipPage(p,pageLength);
            Package.render('create', {
                user:user,
                list:channels,
                page:page
            }, function(err, html) {
                if(err) console.log(err);
                res.send(html);
            });
    })
}

//展示用户关注的频道
exports.renderWatch = function(req,res,Package){
    var userId = req.params['userId'];
    var p=req.query.p||1;
    var limit=1;//每页显示的数量
    async.waterfall([
        function (callback) {
        User.findOne({_id:userId}, function (err, user) {
            callback(null,user);
        });},
        function(user,callback){
        Channel2User.count({'userId':req.user._id},function(err,count){
            if(err) return console.log(err);
            var pageLength=Math.ceil(count/limit);
            callback(err,user,pageLength);
        });},
        function(user,pageLength,callback){
            var minPage;
            //防止大于翻页上限
            if(p>pageLength&&pageLength>0) minPage=pageLength;
            else minPage=p;
            //防止超过下限
            if (minPage<1){minPage=1;}
        Channel2User.find({"userId":req.user._id}).sort({lastTime:-1}).skip(limit*(minPage-1)).limit(limit).exec(function (err, doc) {
            if(err) console.log(err);
            if(doc.length === 0) return callback(null,user,pageLength,[]);
            callback(null,user,pageLength,doc);
        });}
        ],
        function(err,user,pageLength,channels){
            var page=tool.skipPage(p,pageLength);console.log(channels);
            Package.render('watch', {
                user:user,
                list:channels,
                page:page
            }, function(err, html) {
                if(err) console.log(err);
                res.send(html);
            });
    })



    // var userId = req.params['userId'];
    // var limit=10;
    // async.parallel({
    //         user:function (callback) {
    //             User.findOne({_id:userId}, function (err, user) {
    //                 callback(null,user);
    //             });
    //         },
    //         list:function(callback){
    //             Channel2User.find({userId:userId},{ _id: 0, channelId: 1 },function(err,doc){
    //                 if(err) console.log(err);
    //                 var channelIds = []
    //                 doc.forEach(function(item){
    //                     channelIds.push(item.channelId);
    //                 });
    //                 Channels.find({_id:{$in:channelIds}}).sort({time:-1}).limit(limit).exec(function (err, doc) {
    //                     if(err) console.log(err);
    //                     if(doc.length === 0) return callback(null,[]);
    //                     callback(null,doc);
    //                 });
    //             });
    //         }
    //     },
    //     function(err,results){
    //         var user = results.user;
    //         var list = results.list;
    //         Package.render('watch', {
    //             user:user,
    //             list:list
    //         }, function(err, html) {
    //             if(err) console.log(err);
    //             res.send(html);
    //         });
    //     });
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










