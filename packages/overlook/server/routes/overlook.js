'use strict';

// The Package is past automatically as first parameter
var index = requre('../controllers/index');
module.exports = function(Overlook, app, auth, database) {



  app.get('/overlook/deleteUser',function(req, res, next) {
    index.deleteUser(req,res);
  });

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
