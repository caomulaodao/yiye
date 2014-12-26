'use strict';

var mean = require('meanio');

var mongoose = require('mongoose'),
    async = require('async'),
    jquery = require('jquery'),
    request = require('request'),
    jsdom = require ('jsdom'),
    iconv = require ('iconv-lite'),//应对gbk的网址
    BufferHelper = require('bufferhelper'),
    User = mongoose.model('User'),
    Channel2User = mongoose.model('Channel2User'),
    Bugs = mongoose.model('Bugs'),
    Channels = mongoose.model('Channels'),
    Bookmarks = mongoose.model('Bookmarks'),
    tool=require('../../../../config/tools/tool'),
    myVerify=require('../../../../config/tools/verify');

//渲染首页 注入用户数量,频道数量,标签数量
exports.render = function(req, res,Package) {
    if (req.user){return res.redirect('/home')}//如果用户已登录 则跳转到home界面
    async.parallel([
        function(cb){
        User.count({},function(err,user_number){
            if (err) {console.log(err);return res.error();}
            cb(err,user_number)});
        },
        function(cb){
            Channels.count({},function(err,channel_number){if(err){console.log(err);return res.error();}
                cb(err,channel_number);
            });
        },
        function(cb){
            Bookmarks.count({checked:{$in:[1,3,5]}},function(err,label_number){
                if (err) {console.log(err);return res.error();}
                cb(err,label_number)});
        }],function(err,result){
            if(err){
                console.log(err);
                return res.error();
            }
            else{
                var user_number=result[0];
                var channel_number=result[1];
                var label_number=result[2];
                Package.render('index',{user_number:user_number,channel_number:channel_number,label_number:label_number,user:req.user},
                    function(err,html){
                    if(err) {consoe.log(err);return res.sendError()}
                        res.send(html);
                    }
                );
            }
        })

};
exports.bugs = function(req,res){
  if (!myVerify.isEmail(req.body.email)){
      return res.sendResult("含有非法字符",2001,null);
  }
  var bug = new Bugs(req.body);
  var errors = req.validationErrors();
  if (errors) {
      return res.sendResult(errors,2001,null);
  }
  bug.save(function(err){
        if(err){
            return res.sendResult("提交错误",3000,null);
        }
  },function(){
    return res.sendResult("提交成功","0",null);
  });

}
//渲染发现页面
exports.explore = function(req, res,Package){
    var limit = 20;//每页限制显示数
    var p=req.query.p||1;
    if (!myVerify.isNumber(p)){p=1;}//判断参数是否合法
    async.waterfall([function(cb){
        Channels.count({},function(err,count){
            if (err){console.log(err);return res.error()}
            cb(err,count);
        })
    },
    //所有热门频道 按关注度排行
    function(count,callback){
        var pageLength=Math.ceil(count/limit),page=tool.skipPage(p,pageLength);
        var minPage;
        //防止大于翻页上限
        if(p>pageLength&&pageLength>0) minPage=pageLength;
        else minPage=p;
        //防止超过下限
        if (minPage<1){minPage=1;}
        Channels.find().sort({subNum:-1,bmkNum:-1}).skip(limit*(minPage-1)).limit(limit).exec(function (err, channels) {
            if(err) {console.log(err);return res.error()}
            callback(err,channels,page);
        });
    },
    //用户关注的频道
    function(channels,page,callback){
        if (!req.user) return callback(null,channels,page,[]);
        Channel2User.find({'userId':req.user._id},function(err,channel2user){
            if (err) {console.log(err);return res.error()}
            var channel2userId=[];
            channel2user.forEach(function(item){
                channel2userId.push(item.channelId+'');
            });
            callback(err,channels,page,channel2userId);
        })
    }
    ],function(err,channels,page,channel2userId){
        if (err) {console.log(err);return res.error()}
        channels.forEach(function(item,index,array){
            if (channel2userId.indexOf(item._id+'')>-1){
                array[index].isAttention=true;//已经关注
            }
        });
            Package.render('explore', {
                channels:channels,user:req.user,page:page
            }, function(err, html) {
                if(err) {console.log(err);return res.sendError()}
                res.send(html);
            });
        });
}

//查询处理
exports.query = function(req,res,Package){
    if(!req.query.q){
        return res.redirect('/explore');
    }
    //查询最大字数 searchMax
    var searchMax=15;
    var search = req.query.q;
    var searchPage=req.query.p||1;
    if (!myVerify.isNumber(searchPage)) {return res.error();}
    searchPage=+searchPage;
    var limit=30;//单页显示数
    if(search.length>=searchMax){
        search=search.substr(0,searchMax);
    }
    search=tool.stripscript(search);//过滤非法字符 仅支持中文 数字 英文下划线搜索
    async.waterfall([
        //返回频道总数count
        function(cb){
            Channels.count({name:new RegExp(search,'i')},function(err,count){
                if (err) {console.log(err);return res.error()}
                cb(err,count);
            });
        },
        function(count,callback){
            var pageLength=Math.ceil(count/limit);
            var minPage;
            //防止大于翻页上限
            if(searchPage>pageLength&&pageLength>0) minPage=pageLength;
            else minPage=searchPage;
            //防止超过下限
            if (minPage<1){minPage=1;}
            Channels.find({name:new RegExp(search,'i')}).sort({subNum:1}).skip(limit*(minPage-1)).limit(limit).exec(function(err,channels){
                if (err) {console.log(err);return res.error()}
                var page=tool.skipPage(minPage,pageLength);
                callback(err,page,channels);
            });
        },
        function(page,channels,callback){
            if (!req.user) return callback(null,page,channels,[]);
            Channel2User.find({'userId':req.user._id},function(err,channel2user){
                if (err) {console.log(err);return res.error()}
                var channel2userId=[];
                channel2user.forEach(function(item){
                    channel2userId.push(item.channelId+'');
                });
                callback(err,page,channels,channel2userId);
            })
        }],
        function(err,page,channels,channel2userId){
            if (err) {console.log(err);return res.error()}//bug
            channels.forEach(function(item,index,array){
                array[index].isAttention=false;
                if (channel2userId.indexOf(item._id+'')>-1){
                    array[index].isAttention=true;//已经关注
                }
            });
        Package.render('query',{channels:channels,query:search,page:page,user:req.user},function(err,html){
            if (err){console.log(err);return res.sendError();}
            res.send(html);
        });       
    })
};
//爬虫
exports.scraper = function(req,res){
    if (!req.user){return res.sendResult('请先登陆或注册',1000,null);}
    var userUrl = req.body.website;
    //参数检测
    if (userUrl==null) {return res.sendResult('url地址不能为空',2012,null);}
    if (typeof userUrl!=='string') {return res.sendResult('url地址格式错误',2013,null);}
    var url = tool.safeUrl(userUrl);
    if (!url) return res.sendResult('url地址格式错误',2013,null);
//开始爬指定url

    //请求头部设定
    var options = {
        'url': url,
        'headers': {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
        }
    };
    //传入dom后的处理函数
    var callback = function(err,response,content){
        if (err) {console.log(err);return res.sendResult('访问该网站出错',3001,null);}
        console.log(response.statusCode);
        if (!err&&response.statusCode == 200){
            // var bufferhelper = new BufferHelper();
            // var str = iconv.decode(content, 'GBK'); //return unicode string from GBK encoded bytes
            // str = bufferhelper.concat(str);
            // str = bufferhelper.toBuffer().toString('UTF8');
            // console.log(str);
            var window = jsdom.jsdom(content).parentWindow;
            var $ =jquery(window);
        }
        var title=$('title').text();
        var description=$('meta[name=description]').attr('content');
        if (!description){
            description = $('p').text().substr(0,100);
        }
        var imgUrl =""; //$('p img').attr('src')||$('img').attr('src');
        //判断是相对路径还是绝对路径
        if (!myVerify.isUrl(imgUrl)){
            imgUrl = url+'/'+imgUrl;
        }
        var isEmpty = true;
        if (title.length>0){isEmpty = false}
        var result = {
            title:title,
            description:description,
            imgUrl:imgUrl,
            website: url,
            isEmpty:isEmpty
        };console.log(result);
        res.sendResult('返回网站信息成功',0,result);
    }
    request(options,callback);

}
exports.error = function(req,res,Package){
    Package.render('500',{},function(err,result){
        if (err) {console.log();return res.send('服务器挂了...');}
        res.send(result);
    })
}









