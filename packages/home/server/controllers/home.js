/**
 * Created by laodao on 14-10-15.
 */

var mongoose = require('mongoose'),
    async = require('async'),
    bookmarks = require('../../../bookmarks/server/controllers/bookmarks'),
    xss =require('xss'),
    moment = require('moment');
    User = mongoose.model('User'),
    tool = require('../../../../config/tools/tool');
    Channel2User = mongoose.model('Channel2User'),
    Channels = mongoose.model('Channels'),
    Bookmarks = mongoose.model('Bookmarks');
    Myverify = require('../../../../config/tools/verify');

//渲染Home页面
exports.initHome = function(req,res,Home){
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
                        Bookmarks.count({channelId:item.channelId,checked:{$in:[1,3,5]},postTime:{$gte:item.lastTime}},function(err,count){
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
                        Bookmarks.count({channelId:item.channelId,checked:{$in:[1,3,5]},postTime:{$gte:item.lastTime}},function(err,count){
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
                Bookmarks.count({"postUser.userId" : req.user._id,checked:{$in:[1,2]}},function(err,news){
                    if(err) console.log(err);
                    callback(null,news);
                });
            }
        },
        function(err, results) {
            //渲染home页面
            console.log(req.headers);
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
    if(!req.user) return res.sendResult('请先登录或注册',1000,null);
    var allCount = 5;
    var nameLength=20,descriptionLength=100;
    if (!req.body.name) return res.sendResult('频道名称不能为空',2001,null);
    if (!req.body.logo) return res.sendResult('logo不能为空',2002,null);
    if (!req.body.description) return res.sendResult('频道描述不能为空',2003,null);
    if (!req.body.tags) return res.sendResult('标签不能为空',2004,null);
    if (!req.body.type) return res.sendResult('频道类型不能为空',2005,null);  
    if (typeof req.body.name!='string'
        ||typeof req.body.logo!='string'
        ||typeof req.body.description!='string'
        ||typeof req.body.tags!='string'
        ||typeof req.body.type!='string'
        ||typeof req.body.banner!='string'){
        return res.sendResult('数据类型错误',2000,null);}//频道资料不规范
    var newchannel={
        logo:xss(req.body.logo,{whiteList:{}}),
        name:xss(req.body.name,{whiteList:{}}),
        description:xss(req.body.tags,{whiteList:{}}),
        type:xss(req.body.type,{whiteList:{}}),
        tags:xss(req.body.tags,{whiteList:{}}),
        banner:xss(req.body.banner,{whiteList:{}})
    };//xss过滤
    if(newchannel.name.length>nameLength) {return res.sendResult('频道名限制15字',2006,null)}//频道名长度限制
    if(newchannel.description.length>descriptionLength) {return res.sendResult('描述限制100字',2007,null)}//描述长度限制
    var channels = new Channels(newchannel);
    channels.tags = getTags(channels.tags);
    channels.creator = {userId:req.user._id,userName:req.user.username,userLogo:req.user.avatar};
    async.waterfall([
        function(callback){
            //判断是否还可以创建频道，等于5则不可以
            Channel2User.count({userId:req.user._id,type:'creator'},function(err,count){
                if(count>=allCount){
                    callback(null,false);
                }else{
                    callback(null,true);
                }
            });
        },
        function(isCreate,callback){
            if(isCreate){
                channels.save(function(err,doc){
                    if(err) {console.log(err);return res.sendResult('服务器内部问题',5000,null)}
                    var admChannel = new Channel2User({
                        userId:req.user._id,
                        channelId:doc._id,
                        name: channels.name,
                        type: "creator",
                        logo: channels.logo
                    });
                    admChannel.save(function(err){
                        if(err) {console.log(err);return res.sendResult('服务器内部问题',5000,null)}
                        User.update({_id:req.user._id},{$inc:{createNum:1}},function(err,num){
                            if(err) {console.log(err);return res.sendResult('服务器内部问题',5000,null)}
                            callback(null,isCreate);
                        });
                    });
                });
            }else{
                callback(null,isCreate);
            }
        }
    ],function(err,isCreate){
           if(isCreate){
                res.sendResult("频道创建成功",0,null);
           }else{
               res.sendResult("创建数量已达上限，无法创建新频道。",3000,null);
           }
    });
};

//获取关注或是建立的频道
exports.getChannelsList = function(req,res){
    if(!req.user) return res.sendResult('请先登录或注册',1000,null);
    Channel2User.find({userId:req.user._id},'channelId name logo type lastTime news',function(err,channels){
        if(err){console.log(err);return res.sendResult('服务器内部问题',5000,null)}
        async.map(channels,function(item,callback){
            Bookmarks.count({channelId:item.channelId,postTime:{$gte:item.lastTime}},function(err,count){
                item['news'] = count;
                callback(null,item);
            });
        },function(err,results){
            if(err){console.log(err);return res.sendResult('服务器内部问题',5000,null)}
            results.sort(function(a,b){
                return a.news < b.news ? 1 : -1;
            });
            res.sendResult('返回成功',0,results);
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
    if (!Myverify.idVerify(bookmarkId)) return res.sendResult('请求参数错误',2000,null);//id验证
    Bookmarks.update({_id:bookmarkId},{$inc:{checked:2}},function(err,num){
        if(err) {console.log(err);return res.sendResult('服务器内部错误',5000,null)}
        res.sendResult('此信息已经加入历史记录。',0,null);
    });
}


function getTags(str){
    if(!str) return [];
    str = str.toString();
    var tags = [];
    var array = str.split(/[,，\s]/);
    array.forEach(function(item){
        newItem = item.trim();
        if(newItem !== ''){
            tags.push(newItem);
        }
    });
    return tags;
}

//ajax加载'发现'页面内容
exports.discover = function(req,res){
    if(!req.user) return res.redirect('/');
    //number为请求次数 limit为每次返回的数量
    var number=req.query.number||1;
    var limit=12;
    if (!Myverify.isNumber(number)){return res.sendResult('请求参数错误',2000,null)}//传入参数格式进行判断
    if (number==1){limit=24}
    async.waterfall([
            function(callback1){
                Channels.find().sort({'subNum':-1,'bmkNum':-1,'time':-1}).skip((number-1)*limit).limit(limit).exec(function(err,doc){
                    if(err) {console.log(err);return res.sendResult('服务器内部错误',5000,null)}       
                     callback1(null,doc);
                });
            },
            //获取最后一个频道
            function(results,callback){
                Channels.find().sort({subNum:1,time:1}).limit(1).exec(function(err,doc){
                    if (err) { console.log(err);return res.sendResult('服务器内部错误',5000,null)}
                    if(doc.length===0) {callback(null,results,[]);}
                    else{
                        callback(null,results,doc[0]);
                    }
                })
            },
            //是否关注
            function(results,doc,callback){
                Channel2User.find({userId:req.user._id},function(err,channel2user){
                    if (err) {console.log(err);return res.sendResult('服务器内部错误',5000,null)}
                    var channel2userId=[];
                    channel2user.forEach(function(item){
                        channel2userId.push(item.channelId+'');
                    });
                    callback(err,results,doc,channel2userId);
                })
            }],
            function(err, results,doc,channel2userId) {
                if (err) {console.log(err);return res.sendResult('服务器内部错误',5000,null)}
                var isHave=true;
                var  results = JSON.parse(JSON.stringify(results));
                results.forEach(function(item,index,array){
                    if (channel2userId.indexOf(item._id+'')>-1){
                        results[index]['isAttention'] = true;//已经关注
                    }
                });
                if(results.length==0) {isHave=false;}
                else{
                    if (results[0]['time']+''==doc['time']+''){
                        isHave=false;
                    }
                }//
                console.log(results);
                res.sendResult('加载成功',0,{list:results,isHave:isHave})
            });
}

//ajax加载加载bookmarks
exports.ajaxBookmarks = function(req,res){
    if(!req.user) return res.sendResult('请先注册或登录',1000,null);
    var nowDate = new Date();
    var nowday = nowDate.getDate();
    if (nowday<10){nowday='0'+nowday}
    var now = nowDate.getFullYear()+'-'+nowDate.getMonth()+'-'+nowDate.getDate();
    var date=req.query.date||now, limit = 20;//date为前端当前展示的时间
    date=moment(date).toDate();
    var channelId = req.query['channelId'];
    if (!Myverify.idVerify(channelId)) return res.sendResult("请求参数格式错误",2000,null);
    async.parallel({
        list: function(callback){
            //获取对应频道的书签
             Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]},postTime:{$lt:date}}).sort({postTime:-1}).limit(limit).exec(function (err, doc) {
                if(err) console.log(err);
                if(doc.length === 0) return callback(null,[]);
                var targetTime = doc[doc.length -1]['postTime'];//取出来的最后一天的时间
                var startDay = moment(doc[doc.length -1]['postTime']).startOf('day').toDate();
                Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]},postTime:{$gte:startDay,$lt:date}}).sort({postTime:-1}).exec(function(err,list){
                    if(err) console.log(err);
                    callback(null,list);
                });
            })
        },
        endbookmarkId: function(callback){
            Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]}}).limit(1).sort({postTime:1}).exec(function(err,doc){
                if(err) return console.log(err);
                callback(null,doc)
            })
        }
    },function(err,results){
        results.isHave=true;//下次是否还进行ajax请求
        results.nextTime=null;//请求加载的书签的时间
        if(results.endbookmarkId.lenght===0) results.isHave=false;
        if(results.list.length===0) results.isHave=false;
        else{
            if(results.list[results.list.length-1]['_id']+''==results.endbookmarkId[0]['_id']+''){
                results.nextTime=moment(results.list[results.list.length-1]['postTime']).format('YYYY-MM-DD');
                results.isHave=false;
            }         
        }
        results.list=tool.listToArray(results.list);
        //更新频道最后访问时间并返回数据
        Channel2User.update({channelId:channelId,userId:req.user._id},{lastTime:Date.now()},function(err){
            if(err) {console.log(err);return res.sendResult('服务器内部问题',5000,null);}
            res.sendResult('加载成功',0,results);
        });
    });
}

//ajax返回新消息
exports.newNews = function(req,res){
    if(!req.user) return res.sendResult('请先登录或注册',1000,null);
    var limit=10;//一次ajax请求返回的数量
    var number = req.query.number||1;
    if(!Myverify.isNumber(number)) {return res.sendResult('请求参数格式错误',2000,null)}
    async.waterfall([
        function(callback){
            Bookmarks.find({'postUser.userId':req.user._id,checked:{$in:[1,2]}}).sort({postTime:1}).limit(1)
            .exec(function(err,doc){if(err){console.log(err);return res.sendResult('服务器内部错误',5000,null)}callback(err,doc)});
        },
        function(doc,callback){
            Bookmarks.find({'postUser.userId':req.user._id,checked:{$in:[1,2]}}).sort({postTime:-1}).skip((number-1)*limit).limit(limit).exec(function(err,list){
                if (err) {console.log(err);return res.sendResult('服务器内部错误',5000,null)}
                var isHave=true;
                if(list.length==0) {isHave=false;}
                else{
                    if(doc[0]['postTime']+''==list[list.length-1]['postTime']+''){
                        isHave=false;
                    }
                }
                callback(err,list,isHave);
            })
        }],
        function(err,list,isHave){
            if(err){console.log(err);return res.sendResult('服务器内部错误',5000,null)}
            res.sendResult('返回成功',0,{news:list,isHave:isHave});
        }
    )
}
//ajax返回历史消息
exports.history = function(req,res){
    if(!req.user) return res.sendResult('请先注册或登录',1000,null);
    var limit=10;
    var number = req.query.number||1;
    if(!Myverify.isNumber(number)) {return res.sendResult('请求参数格式错误',2000,null)}
    async.waterfall([
        function(callback){
            Bookmarks.find({'postUser.userId':req.user._id,checked:{$in:[3,4]}}).sort({postTime:1}).limit(1)
            .exec(function(err,doc){if(err){console.log(err);return res.sendResult('服务器内部错误',5000,null)}callback(err,doc)});
        },
        function(doc,callback){
            Bookmarks.find({'postUser.userId':req.user._id,checked:{$in:[3,4]}}).sort({postTime:-1}).skip((number-1)*limit).limit(limit).exec(function(err,list){
                if (err) {return console.log(err);}
                var isHave=true;
                if(list.length==0) {isHave=false;}
                else{
                    if(doc[0]['postTime']+''==list[list.length-1]['postTime']+''){
                        isHave=false;
                    }
                }
                callback(err,list,isHave);
            })
        }],
        function(err,list,isHave){
            if(err){console.log(err);return res.sendResult('服务器内部错误',5000,null)}
            res.sendResult('返回成功',0,{hismes:list,isHave:isHave});
        }
    )
}
