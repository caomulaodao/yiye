'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Channels = mongoose.model('Channels'),
  async = require('async'),
  config = require('meanio').loadConfig(),
  crypto = require('crypto'),
  xss = require('xss'),
  nodemailer = require('nodemailer'),
  templates = require('../template');
  var myVerify=require('../../../../config/tools/verify');



/**
 * 退出登录
 *
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * Logout web API (by coolbit.in@gmail.com)
 */
exports.web_api_logout = function(req, res) {
  if(req.isAuthenticated()){
    req.logout();
    if (req.isUnauthenticated())
        res.sendResult("退出成功",0,null);
    else
        res.sendResult("注销失败",3001,null);
  }
  else
      res.sendResult("未登录",1001,null);

};

/**
 * Session
 */
exports.session = function(req, res) {
  res.redirect('/');
};

/**
 * 用户注册
 */
exports.create = function(req, res, next) {
  var username=req.body.username;console.log(req.body);
  //注册名字非法的时候
  if (!myVerify.userVerify(username)){
      return res.sendResult("含有非法字符",2001,null);
  }
  var user = new User(req.body);
  user.provider = 'local';
  user.verifyToken = crypto.randomBytes(20).toString('hex') + crypto.createHash('md5').update(user.email).digest('hex').substr(0,16);
  // because we set our user.provider to local our models/user.js validation will always be true
  req.assert('email', '请输入有效的邮箱地址').isEmail();
  req.assert('password', '密码长度为6到20位').len(6, 20);
  req.assert('username', '用户名长度为2到12位').len(2, 12);

  var errors = req.validationErrors();
  if (errors) {
      return res.sendResult(errors,2001,null);
  }

  // Hard coded for now. Will address this with the user permissions system in v0.3.5
  user.roles = ['authenticated'];
  user.save(function(err){
    if(err){
      switch (err.code) {
        case 11000:
            return res.sendResult("邮箱已经被注册",3001,null);
          break;
        case 11001:
            return res.sendResult("用户名已经被注册",3002,null);
          break;
        default:
          if (err.errors){
            return res.sendResult(err.errors[0],3000,null);
          }
      }
    }
    sendVerify(user,req, function() {
      var emailServer = 'http://mail.'+(user.email).split("@")[1];
      req.flash('emailServer',emailServer);
        return res.sendResult("注册成功",0,{
            redirectUrl:'/verify'
        });
    });
  });
};

/**
 * 获取当前访问用户信息
 *
 */

exports.me = function(req, res) {
  if(req.user){
      //如果用户已经登录
      return res.sendResult("成功获取用户信息",0,req.user);
  }else
  {
      //用户未登录
      return res.sendResult("用户未登录",100,null);
  }
};


/**
 * 重置用户账号密码
 *
 */

exports.resetpassword = function(req, res, next) {
  User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function(err, user) {
    if (err) {
        return res.sendResult(err,5001,null);
    }
    if(!user){
        return res.sendResult('此链接失效，请重新找回密码',3001,null);
    }
    req.assert('password', '密码长度为6到20位').len(6, 20);
    req.assert('password2', '两次输入密码不相同').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
        return res.sendResult(errors,2001,null);
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.save(function(err) {
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.sendResult("密码重置成功",0,{
            redirectUrl:'/home'
        });
      });
    });
  });
};

/**
 * Send reset password email
 */
function sendMail(mailOptions) {
  var transport = nodemailer.createTransport('SMTP', config.mailer);
  transport.sendMail(mailOptions, function(err, response) {
    if (err) {console.log('err:'+err);return err;}
    transport.close();
    return response;
  });
}
/**
 *  发送验证邮件
 */

function sendVerify(user,req,done){
    var mailOptions = {
        to: user.email,
        from: config.emailFrom
    };
    mailOptions = templates.verify_register_email(user, req, user.verifyToken, mailOptions);
    var sendInfo = sendMail(mailOptions);
    done();
}

/**
 * 激活邮箱
 */
exports.verify = function(req, res, next){
    User.findOne({
        verifyToken: req.params.token
    }, function(err, user) {
        if (err) {
           return res.redirect('/');
        }
        if(!user) {
           return res.redirect('/');
        }
        user.verifyToken = undefined;
        user.save(function(err) {
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.redirect('/home');
            });
        });
    });
}

/**
 * Callback for forgot password link
 */
exports.forgotpassword = function(req, res, next) {
  async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({
            email: req.body.email
        }, function(err, user) {
          if (err || !user) return done(true);
          done(err, user, token);
        });
      },
      function(user, token, done) {
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      },
      function(token, user, done) {
        var mailOptions = {
          to: user.email,
          from: config.emailFrom
        };
        mailOptions = templates.forgot_password_email(user, req, token, mailOptions);
        sendMail(mailOptions);
        var emailServer = 'http://mail.'+(user.email).split("@")[1];
        req.flash('emailServer',emailServer);
        done(null, true);
      }
    ],
    function(err, status) {
      if(err){
          return res.sendResult("此邮箱用户不存在",3001,null);
      }

      return res.sendResult("等待邮箱验证中",0,{
            redirectUrl:'/waitReset'
      });

    }
  );
};

/**
 * 更新用户信息
 */
exports.update = function(req,res){
    if(!req.user) return res.sendResult('请先登录或注册',1000,null);
    if(req.body.avatar && req.body.intro){
        var avatar = req.body.avatar;
        var intro = req.body.intro;
        if (!myVerify.isString(avatar)||!myVerify.isString(intro)){
            return res.sendResult('参数格式错误',2001,null);
        }
        avatar = xss(avatar,{whiteList:{}});
        intro = xss(intro,{whiteList:{}});
        intro = intro.substr(0,150);
        //更新各处中的个人信息
        async.parallel([
            //更新用表User中的用户信息
            function(callback){
                var update = {};
                update.avatar = avatar;
                update.intro = intro;
                User.update({_id:req.user._id},update,function(err,doc){
                    if(err)  console.log(err);
                    callback(null);
                });
            },
            //更新频道表channels中的创建者信息
            function(callback){
                Channels.update({'creator.userId':req.user._id},{"creator.userLogo":avatar},{ multi: true },function(err,doc){
                    if(err)  console.log(err);
                    callback(null);
                });
            }
        ],
        //返回信息
        function(err, results){
            //修改成功
            return res.sendResult('数据修改成功',0,null);
        });
    }else{
        return res.sendResult('请提交修改的数据',2002,null);
    }
}

/**
 * 修改密码
 *
 */
exports.changePassword = function(req,res){
    if(!req.user) return res.sendResult('请先登录或注册',1000,null);
    var oldPassword = req.body.old;
    var newPassword = req.body.new;
    if(newPassword.lenght < 6 || newPassword.lenght > 20){
        return res.sendResult('新密码长度在6到20位之间。',2001,null);
    }
    User.findOne({_id:req.user._id},function(err,doc){
        if(err) console.log(err);
        if(!doc){
            return res.sendResult('原密码输入错误。',3001,null);
        }
        if(doc.hashed_password === doc.hashPassword(oldPassword)){
            User.update({_id:req.user._id},{hashed_password:doc.hashPassword(newPassword)},function(err,num){
                if(err)  console.log(err);
                return res.sendResult('个人信息修改成功。',0,null);
            });
        }
    });
}