'use strict';

// The Package is past automatically as first parameter
var index = require('../controllers/overlook');
module.exports = function(Overlook, app, auth, database) {


  //删除某个用户
  app.post('/overlook/deleteUser',function(req, res, next) {
    index.deleteUser(req,res);
  });
  //删除某个频道
  app.get('/overlook/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/overlook/example/render', function(req, res, next) {
    Overlook.render('index', {
      package: 'overlook'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
