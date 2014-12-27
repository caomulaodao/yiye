'use strict';

module.exports = {
  forgot_password_email: function(user, req, token, mailOptions) {
    mailOptions.html = [
      '<h1>' + user.username + ',你正在重置你的一叶书签密码</h1>',
      '如果你忘记了你在一叶书签的密码，请点击下面的链接，重新设置你的密码：<br/>',
      'http://' + req.headers.host + '/resetPassword/' + token +'<br/>',
      '如果你没有请求忘记密码服务，那么请忽略此邮件。你的密码将不会被改变。<br/>',
      '一叶书签，发现网络之美'
    ].join('\n');
    mailOptions.subject = '重置你的一叶书签密码';
    return mailOptions;
  },
  verify_register_email:function(user,req,token,mailOptions){
      mailOptions.html = [
          '<h1>' + user.username + '，欢迎加入一叶书签<h1>',
          '为了你可以正常使用一叶书签，点击链接地址，完成邮箱认证：<br/>',
          'http://' + req.headers.host + '/verified/' + token+'<br/>',
          '一叶书签，发现网络之美'
      ].join('\n');
      mailOptions.subject = '请确认你在一叶书签的注册邮箱';
      return mailOptions;
  }
};
