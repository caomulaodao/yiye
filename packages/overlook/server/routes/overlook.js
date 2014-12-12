'use strict';

// The Package is past automatically as first parameter
module.exports = function(Overlook, app, auth, database) {

  app.get('/overlook/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/overlook/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
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
