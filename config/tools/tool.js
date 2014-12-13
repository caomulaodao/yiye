//分页 searchPage查询的页数 listLength为总页数,limit每页限制数 返回一个包含当前页数和该显示页数的对象
var moment = require('moment');
function skipPage(searchPage,listLength){
    searchPage=+searchPage;
    if(isNaN(searchPage)) searchPage=1;
    if(searchPage>listLength) searchPage=listLength;
    if(searchPage<1) searchPage=1;
    var show=[],i;
    var number=0;//计数
    //快到底页了
    if(searchPage+2>listLength){
        for(i=listLength,number=0;i>0;i--,number++){
            show.push(i);
            if(number==4) break;
        }
        show.reverse();
    }
    else if(searchPage-2<1){
        for(i=1,number=0;i<=listLength;i++,number++){
            show.push(i)
            if(number==4) break;
        }
    }
    else{console.log('??');
        for(i=searchPage-2,number=0;;i++,number++){
            show.push(i);
            if(number==4) break;
        }
    }
    //当前页数和显示

    return {
        now:searchPage,
        show:show,
        before:searchPage-1,//上一页
        after:parseInt(searchPage)+1,
        max:listLength
        }
}

//将一个bookmarks列表格式化为按时间集合排序的数组。
function listToArray(list){
    if(list.length==0) return [];
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
//过滤非法字符
function stripscript(s) {
    var pattern = /[^0-9a-zA-Z\u4E00-\u9FA5_]/g;//过滤搜索的非法字符
        var rs = "";
        rs = s.replace(pattern, '');
    return rs;
}
//将用户输入的url转换为可以访问的url 如果匹配不成功就返回false 否则返回 服务器可以访问的链接
function safeUrl(url){
    var RegUrl = new RegExp();
    RegUrl.compile("^(https?://)?[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$",'g');
    var result = RegUrl.test(url,'head');
    if (!result) return false;
    if(RegExp.head) return url;
    return 'http://'+url;
}

//分页
exports.skipPage = skipPage;
//日期的文档排序成数组
exports.listToArray=listToArray;
//过滤非法字符
exports.stripscript = stripscript;
//将用户输入的url转换为可访问的url
exports.safeUrl = safeUrl;