var xss = require('xss');
//用户注册页面非法字符检测
function userVerify(str){
	if(typeof str!='string') return false;
    if(/^[0-9]/.test(str)) return false;
    var re = new RegExp('^[\u4E00-\u9FA5a-zA-Z0-9_]{2,12}$');
    if(!re.test(str)) return false;
    return true;
}//用户注册验证,只能使用数字,字母,汉字,和下划线,且不能全为数字,也不能以数字开头
function idVerify(str){
    if (typeof str!='string') return false;
    var re = /^[0-9a-zA-Z]{24}$/;//判断是否Id格式
    return re.test(str);
}
function xssVerify(str){
	if (typeof str!='string') {var str='';}
	var options={
		whiteList:{},
	};//定过滤规则
	var myxss= new xss.FilterXSS(options);
	return myxss.process;
}
//数组xss过滤
function xssArray(array){
	if (Object.prototype.toString.call(array)!=='[object Array]'){
		return [];
	}
	for (var i=0;i<array.length;i++){
		array[i] = xss(array[i],{whiteList:{}});
	}
	return array;
}
// function xssEscape(str){
// 	if typeof str!='string' return '';
// 	var options={
// 		whiteList:{},
// 	}
// }

//判断是否字符串
function isString(str){
	return typeof str==='string';
}
//判断是否数组
function isArray(array){
	 return Object.prototype.toString.call(array) === '[object Array]';  
}
//判断是否数字
function isNumber(number){
	var number = +number;
	return !isNaN(number);
}
exports.userVerify = userVerify;
exports.idVerify = idVerify;
exports.xssVerify = xssVerify;
exports.isString = isString;
exports.isArray = isArray;
exports.isNumber = isNumber;