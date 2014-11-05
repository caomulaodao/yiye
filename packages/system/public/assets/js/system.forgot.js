/**
 * Created by laodao on 14-8-29.
 */
var API_ForgotEmailUrl = "/forgot-password";

//监听注册事件
$('#YIYE_ConfirmEmail').click(function(){
    if(!verificationForm()) return false;
    $.ajax({
        cache: false,
        type: "POST",
        url:API_ForgotEmailUrl,
        data:$('#YIYE_ForgotEmailForm').serialize(),
        statusCode: {
            401: function(res) {
                showSigninError(res.responseJSON['message']);
            },
            200:function(res){
                location.href = res.redirectUrl;
            }
        }
    });
});

//本地验证提交数据是否合法
function verificationForm(){
    var formArray = $('#YIYE_ForgotEmailForm').serializeArray();
    if(!verification.isEmail(formArray[0]['value']))  {showSigninError("请输入有效的邮箱地址");return false;}
    return true;
}
//提示注册错误
function showSigninError(err){
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

