'use strict';

var mean = require('meanio');

var mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User'),
    Channel2User = mongoose.model('Channel2User'),
    Channels = mongoose.model('Channels'),
    Bookmarks = mongoose.model('Bookmarks');

//渲染首页 注入用户数量,频道数量,标签数量
exports.render = function(req, res,Package) {
    async.parallel([
        function(cb){
        User.count({},function(err,user_number){cb(err,user_number)});
        },
        function(cb){
            Channels.count({},function(err,channel_number){cb(err,channel_number)});
        },
        function(cb){
            Bookmarks.count({},function(err,label_number){cb(err,label_number)});
        }],function(err,result){
            if(err){
                console.log(err);
            }
            else{
                var user_number=result[0];
                var channel_number=result[1];
                var label_number=result[2];
                Package.render('index',{user_number:user_number,channel_number:channel_number,label_number:label_number,user:req.user},
                    function(err,html){
                    if(err) consoe.log(err);
                        res.send(html);
                    }
                )
            }
        })

};

//渲染发现页面
exports.explore = function(req, res,Package){
    var limit = 100;
    Channels.find().sort({subNum:1}).skip(0).limit(limit).exec(function (err, channels) {
        if(err) return console.log(err);
        Package.render('explore', {
            channels:channels
        }, function(err, html) {
            if(err) console.log(err);
            res.send(html);
        });
    });
}
//查询处理
exports.query = function(req,res,Package){
    //查询最大字数 searchMax
    var searchMax=15;
    var search = req.query.q;
    var searchPage;
    var limit=30;//单页显示数
    if(search.length>=searchMax){
        search=search.substr(0,searchMax);
    }
    
    async.waterfall([
        //返回频道总数count
        function(cb){
            Channels.count({name:new RegExp(search,'i')},function(err,count){
                if (err) console.log(err);
                cb(err,count);
            });
        }
    ],function(err,count){
        if (err) console.log(err);
        var pageLength=Math.ceil(count/limit);
        if(!req.query.p) searchPage=1;
        else{
            searchPage=req.query.p;
            if(searchPage>=pageLength) searchPage=pageLength
            if(searchPage<1) searchPage=1;
        }
        //
        Channels.find({name:new RegExp(search,'i')}).sort({subNum:1}).skip(limit*(searchPage-1)).limit(limit).exec(function(err,channels){
            var page=skipPage(searchPage,pageLength);
            if (err) return console.log(err);
            Package.render('query',{channels:channels,query:search,page:page},function(err,html){
                if (err) console.log(err);
                res.send(html);
            });       
        })
    })

}

//分页 searchPage查询的页数 listLength返回的页数,limit每页限制数 返回一个包含当前页数和该显示页数的对象
function skipPage(searchPage,listLength){
    if(searchPage>listLength) searchPage=listLength;
    if(searchPage<1) searchPage=1;
    var show=[],i;
    var number=0;//计数
    //快到底页了
    if(searchPage+2>listLength){
        for(i=listLength,number=0;i>0;i--){
            show.push(i);
            if(number==4) break;
        }
        show.reverse();
    }
    else if(searchPage-2<1){
        for(i=1,number=0;i<=listLength;i++){
            show.push(i)
            if(number==4) break;
        }
    }
    else{
        for(i=searchPage-2;i<=searchPage+2;i++){
            show.push(i);
        }
    }
    //当前页数和显示
    return {
        now:searchPage,
        show:show
        }
}

