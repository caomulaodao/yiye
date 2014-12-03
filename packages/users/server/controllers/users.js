'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  async = require('async'),
  config = require('meanio').loadConfig(),
  crypto = require('crypto'),
  nodemailer = require('nodemailer'),
  templates = require('../template');
  var myVerify=require('../../../../config/tools/verify');

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
  res.redirect('/');
};

/**
 * Show login form
 */
 //注册界面
exports.signin = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.redirect('#!/login');
};

/**
 * Logout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * Logout web API (by coolbit.in@gmail.com)
 */
exports.web_api_logout = function(req, res) {
  if (req.isAuthenticated()) {
    req.logout();
    if (req.isUnauthenticated())
      res.json({message: 'ok'});
    else
      res.status('401').json({message: '注销失败'});
  }
  else
    res.status('401').json({message: '未登录'});


};
/**
 * Session
 */
exports.session = function(req, res) {
  res.redirect('/');
};

/**
 * Create user
 */
 //创建用户
exports.create = function(req, res, next) {
  var username=req.body.username;
  if(typeof username!='string') {return res.status(400).send([{msg:'含有非法字符'}]);}
  //注册名字非法的时候
  if (!myVerify.userVerify(username)){
      return res.status(400).send([{msg:'含有非法字符'}]);
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
    return res.status(400).send(errors);
  }

  // Hard coded for now. Will address this with the user permissions system in v0.3.5
  user.roles = ['authenticated'];
  user.save(function(err) {
    if (err) {
      switch (err.code) {
        case 11000:
          res.status(400).send([{
            msg: '用户名已经被注册',
            param: 'email'
          }]);
          break;
        case 11001:
          res.status(400).send([{
            msg: '用户名已经被注册',
            param: 'username'
          }]);
          break;
        default:
          var modelErrors = [];

          if (err.errors) {

            for (var x in err.errors) {
              modelErrors.push({
                param: x,
                msg: err.errors[x].message,
                value: err.errors[x].value
              });
            }

            res.status(400).send(modelErrors);
          }
      }

      return res.status(400);
    }
    sendVerify(user,req, function() {
      var emailServer = 'http://mail.'+(user.email).split("@")[1];
      req.flash('emailServer',emailServer);
      return res.status(200).send({
          redirectUrl:'/verify'
      });
    });
  });
};
/**
 * Send User
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
  User
    .findOne({
      _id: id
    })
    .exec(function(err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    });
};

/**
 * Resets the password
 */

exports.resetpassword = function(req, res, next) {
  User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function(err, user) {
    if (err) {
      return res.status(400).json({
        message: err
      });
    }
    if (!user) {
      return res.status(400).json({
        message: '此链接失效，请重新找回密码'
      });
    }
    req.assert('password', '密码长度为6到20位').len(6, 20);
    req.assert('password2', '两次输入密码不相同').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).send(errors);
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.save(function(err) {
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.status(200).send({
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
      if (err) {
          return res.status(401).send({
              message: "此邮箱用户不存在"
          });
      }
      res.status(200).send({
          redirectUrl:'/waitReset'
      });
    }
  );
};

/**
 * 更新用户信息
 *
 */
exports.update = function(req,res){
    if(!req.user) return res.send({err:true,info:'请先登陆或注册'});
    var update = {};
    if(req.body.avatar && req.body.intro){
        update.avatar = req.body.avatar;
        update.intro = req.body.intro;
        User.update({_id:req.user._id},update,function(err,doc){
            if(err) return console.log(err);
            return res.status(200).send({
                info:'个人信息修改成功',
                success:true
            });
        });
    }else{
        return res.status(401).send({
            info:'请提交修改的数据',
            success:false
        });
    }
}

/*
 * 修改密码
 */
exports.changePassword = function(req,res){
    if(!req.user) return res.send({err:true,info:'请先登陆或注册'});
    var oldPassword = req.body.old;
    var newPassword = req.body.new;
    if(newPassword.lenght < 6 || newPassword.lenght > 20){
        return res.status(401).send({
            info:'新密码长度在6到20位之间。',
            success:false
        });
    }
    User.findOne({_id:req.user._id},function(err,doc){
        if(err) console.log(err);
        if(!doc){
            return res.status(401).send({
                info:'原密码输入错误。',
                success:false
            });
        }
        if(doc.hashed_password === doc.hashPassword(oldPassword)){
            User.update({_id:req.user._id},{hashed_password:doc.hashPassword(newPassword)},function(err,num){
                if(err)  console.log(err);
                return res.status(200).send({
                    info:'个人信息修改成功',
                    success:true
                });
            });
        }
    });
}