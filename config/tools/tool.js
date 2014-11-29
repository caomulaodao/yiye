//分页 searchPage查询的页数 listLength为总页数,limit每页限制数 返回一个包含当前页数和该显示页数的对象
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

exports.skipPage = skipPage;
exports.listToArray=listToArray;