/**
 * Created by laodao on 14-8-24.
 *
 *  用户注册
 *
 */

var API_SignupUrl = "/api/account/register";

//监听注册事件
$('#YIYE_Signup').click(function(){
    if(!verificationForm()) return false;
    console.log(2);
    $.ajax({
        cache: false,
        type: "POST",
        url:API_SignupUrl,
        data:$('#YIYE_SignupForm').serialize(),
        success:function(data){
            if(data.code == 0){
                location.href = data.data.redirectUrl;
            }else{
                showSignupError(data.msg);
            }
        }
    });
});

//本地验证提交数据是否合法
function verificationForm(){
    var formArray = $('#YIYE_SignupForm').serializeArray();
    if(!verification.isEmail(formArray[0]['value']))  {showSignupError("请输入有效的邮箱地址");return false;}
    if(!verification.len(formArray[1]['value'],2,12)) {showSignupError("用户名长度为2到12位");return false;}
    if(!verification.len(formArray[2]['value'],6,20)) {showSignupError("密码长度为6到20位");return false;}
    return true;
}
//提示注册错误
function showSignupError(err){
    $("#YIYE_ErrorInfo").text(err).show();
}

//规则验证工具函数

function verification(){

}
//验证email
verification.isEmail = function(email){
   var emailModel = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
   if(typeof email !==  "string")  return false;
   return emailModel.test(email);
}
//验证字符串位数
verification.len = function(str,min,max){
    if(str.length >= min && str.length <= max){
        return true;
    }else{
        return false;
    }
}