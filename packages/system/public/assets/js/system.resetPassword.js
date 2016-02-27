/**
 * Created by laodao on 14-8-29.
 */
var API_ForgotEmailUrl = "/reset";

//监听注册事件
$('#YIYE_ResetPassword').click(function(){
    if(!verificationForm()) return false;
    $.ajax({
        cache: false,
        type: "POST",
        url:API_ForgotEmailUrl,
        data:$('#YIYE_ResetPasswordForm').serialize(),
        success:function(data) {
            if (data.code == 0) {
                location.href = data.data.redirectUrl;
            } else {
                showSigninError(data.msg);
            }
        }
    });
});

//本地验证提交数据是否合法
function verificationForm(){
    var formArray = $('#YIYE_ResetPasswordForm').serializeArray();
    if(!verification.len(formArray[0]['value'],6,20)) {showSigninError("密码长度为6到20位");return false;}
    if(!verification.isSame(formArray[0]['value'],formArray[1]['value'])) {showSigninError("两次输入密码不相同");return false;}

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

verification.isSame = function(strA,strB){
    if(typeof strA !==  "string")  return false;
    if(strA === strB){
        return true;
    }else{
        return false;
    }
}