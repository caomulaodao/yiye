'use strict';

module.exports = function(System, app, auth, database) {

  // Home route
  var index = require('../controllers/index');
  var user = require('../controllers/user');
  //访问首页
  app.get('/',function (req,res,next){
     index.render(req,res,System);
  });

  //访问发现页面
  app.get('/explore',function (req,res,next){
     index.explore(req,res,System);
  });

  app.route('/signup')
      .get(user.signup);

  app.route('/signin')
      .get(user.signin);

  app.route('/verify')
      .get(user.verify);

  app.route('/forgot')
      .get(user.forgot);

  app.route('/waitReset')
      .get(user.waitReset);

  app.route('/resetPassword/:token')
      .get(user.resetPassword);

  //获取七牛云存储上传token
  app.get('/uptoken',user.upToken);
};
