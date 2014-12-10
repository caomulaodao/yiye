'use strict';

// User routes use users controller
var users = require('../controllers/users');

module.exports = function(MeanUser, app, auth, database, passport) {

  app.route('/logout')
    .get(users.signout);

  app.route('/api/user/me')
    .get(users.me);

  // Setting up the users api
  app.route('/api/account/register')
    .post(users.create);

  app.route('/forgot-password')
    .post(users.forgotpassword);

  app.route('/reset')
    .post(users.resetpassword);

  //验证用户邮箱并登录
  app.route('/verified/:token')
        .get(users.verify);

  // Setting the local strategy route
  app.route('/api/account/login')
    .post(function(req,res,next){
          passport.authenticate('local',
              function(err, user, info){
                  if (err) { return next(err); }
                  if(!user){
                      return res.sendResult(info.message,3001,null);
                  }
                  req.logIn(user, function(err) {
                      if (err) { return next(err); }
                      return res.sendResult("登录成功",0,{
                          redirectUrl:'/home',
                          success:true
                      });
                  });
              }
          )(req,res,next);
      }
  );

  //Logout web API (by coolbit.in@gmail.com)
  app.route('/api/account/logout')
    .get(users.web_api_logout);

  //更新用户信息
  app.route('/api/account/update')
      .post(users.update);

  //更新用户信息
  app.route('/api/account/changePassword')
      .post(users.changePassword);



};
