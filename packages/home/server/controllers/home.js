/**
 * Created by laodao on 14-10-15.
 */

var mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User'),
    Channel2User = mongoose.model('Channel2User'),
    Channels = mongoose.model('Channels'),
    Bookmarks = mongoose.model('Bookmarks');

//获取channel数据
exports.getInitChannels = function(req,res,Home){
    if(!req.user) return res.redirect('/');
    async.parallel({
            user: function(callback){
                User.findOne({_id:req.user._id},function(err,user){
                    callback(null,user);
                });
            },
            adm: function(callback1){
                //userId:req.user._id,type:{$in:['creator','admin']}
                Channel2User.find({userId:req.user._id,type:{$in:['creator','admin']}},'channelId name logo type lastTime news',function(err,admChannels){
                    if(err) return console.log(err);
                    async.map(admChannels,function(item,callback2){
                        Bookmarks.count({channelId:item.channelId,postTime:{$gte:item.lastTime}},function(err,count){
                            item['news'] = count;
                            callback2(null,item);
                        });
                    },function(err,results){
                        results.sort(function(a,b){
                            return a.news < b.news ? 1 : -1;
                        });
                        callback1(null,results);
                    });
                });
            },
            sub: function(callback1){
                Channel2User.find({userId:req.user._id,type:'follower'},'channelId name logo type lastTime news',function(err,subChannels){
                    if(err) return console.log(err);
                    async.map(subChannels,function(item,callback2){
                        Bookmarks.count({channelId:item.channelId,postTime:{$gte:item.lastTime}},function(err,count){
                            item['news'] = count;
                            callback2(null,item);
                        });
                    },function(err,results){
                        results.sort(function(a,b){
                            return a.news < b.news ? 1 : -1;
                        });
                        callback1(null,results);
                    });
                });
            },
            creatNum: function(callback){
                Channel2User.count({userId:req.user._id,type:'creator'},function(err,count){
                    callback(null,count)
                });
            },
            news: function(callback){
                Bookmarks.find({"postUser.userId" : req.user._id,checked:{$in:[1,2]}},function(err,doc){
                    if(err) console.log(err);
                    callback(null,doc);
                });
            }
        },
        function(err, results) {
            //渲染home页面
            Home.render('index', {admChannelList:results.adm,subChannelList:results.sub,creatNum:results.creatNum,user:results.user,news:results.news}, function (err, html) {
                //Rendering a view from the Package server/views
                if(err) return console.log(err);
                res.send(html);
            });
        });
}

//添加管理员与频道对应关系
exports.addAdmChannel = function(){

};

//新建一个频道
exports.createChannel = function(req,res){
    var channels = new Channels(req.body);
    channels.tags = getTags(channels.tags);
    channels.creator = {userId:req.user._id,userName:req.user.username,userLogo:req.user.avatar};
    channels.save(function(err,doc){
        if(err){
            return res.send({info:err});
        }
        var admChannel = new Channel2User({
            userId:req.user._id,
            channelId:doc._id,
            name: channels.name,
            type: "creator",
            logo: channels.logo
        });
        admChannel.save(function(err){
            if(err){
                return res.send({info:err});
            }
            res.send({info:"success"});
        });
    });
};

//获取关注或是建立的频道
exports.getChannelsList = function(req,res){
    if(!req.user) return res.status(401).send({info:'请先登录或注册'});
    Channel2User.find({userId:req.user._id},'channelId name logo type lastTime news',function(err,channels){
        if(err) return console.log(err);
        async.map(channels,function(item,callback){
            Bookmarks.count({channelId:item.channelId,postTime:{$gte:item.lastTime}},function(err,count){
                item['news'] = count;
                callback(null,item);
            });
        },function(err,results){
            if(err) return console.log(err);
            results.sort(function(a,b){
                return a.news < b.news ? 1 : -1;
            });
            res.json(results);
        });
    });
};

//用户主页管理界面
exports.check = function(req,res,Home){
    Home.render('check', {}, function (err, html) {
        //Rendering a view from the Package server/views
        if(err) return console.log(err);
        res.send(html);
    });
}


//
exports.newsViewed = function(req,res){
    var bookmarkId = req.body.bookmarkId;
    Bookmarks.update({_id:bookmarkId},{$inc:{checked:2}},function(err,num){
        if(err) console.log(err);
        res.status(200).send({success:true,info:'此信息已经加入历史记录。'});
    });
}


//获取频道排行榜
exports.getChannelsTop = function(req,res){
    var num = req.params['num'];
    var limit = 20;
    Channels.find().sort({subNum:1}).skip(num).limit(limit).exec(function (err, channels) {
        if(err) return console.log(err);
        res.status(200).json({channels:channels});
    });
}

//获取历史记录
exports.history = function(req,res){
    if(!req.user) return res.status(401).send({info:'请先登录或注册'});
    var num = req.params['num'];
    var limit = 20;
    Bookmarks.find({"postUser.userId" : req.user._id,checked:{$in:[3,4]}}).skip(num).limit(limit).exec(function(err,doc){
        if(err) console.log(err);
        res.status(200).json({historys:doc});
    });

}

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
    return tags;
}