'use strict';

/**
 * Module dependencies.
 */
var mean = require('meanio'),
  compression = require('compression'),
  morgan = require('morgan'),
  consolidate = require('consolidate'),
  cookieParser = require('cookie-parser'),
  expressValidator = require('express-validator'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  assetmanager = require('assetmanager'),
  session = require('express-session'),
  mongoStore = require('connect-mongo')(session),
  helpers = require('view-helpers'),
  flash = require('connect-flash'),
  config = mean.loadConfig(),
  express = require('express');

module.exports = function(app, passport, db) {

  app.set('showStackError', true);

  // Prettify HTML
  app.locals.pretty = true;

  // cache=memory or swig dies in NODE_ENV=production
  app.locals.cache = 'memory';

  // Should be placed before express.static
  // To ensure that all assets and data are compressed (utilize bandwidth)
  app.use(compression({
    // Levels are specified in a range of 0 to 9, where-as 0 is
    // no compression and 9 is best compression, but slowest
    level: 9
  }));

  // Only use logger for development environment
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // assign the template engine to .html files
  app.engine('html', consolidate[config.templateEngine]);

  // set .html as the default extension
  app.set('view engine', 'html');
  //浏览器头部检测中间件
  app.use(function(req,res,next){
    var header=req.headers['user-agent'];
    if(typeof header !='string') header='';//如果获取的头部不包含user-agent;
    var staticFile1 = new RegExp('/.*?/assets/.*');
    var staticFile2 = new RegExp('/bower_components/.*')
    function isChrome(str){
       if (str.indexOf('WebKit')>-1) return true;
       else return false;
    }
    if (req.url=='/please/use/chrome'||staticFile1.test(req.url)||staticFile2.test(req.url)){
      next();
    }
    else{
      if(isChrome(header)) next();
      else{res.redirect('/please/use/chrome');}
    }
  });

  //向res中添加函数
  app.use(function(req,res,next){
      //返回格式定义
      res.sendResult = function(msg,code,data){
        res.json({
            msg:msg,
            code:code,
            data:data
        });
      };
      next();
  });

  // The cookieParser should be above session
  app.use(cookieParser());

  // Request body parsing middleware should be above methodOverride
  app.use(expressValidator());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(methodOverride());

  // Import the assets file and add to locals
  var assets = assetmanager.process({
    assets: require('./assets.json'),
    debug: process.env.NODE_ENV !== 'production',
    webroot: /public\/|packages\//g
  });

  // Add assets to local variables
  app.use(function(req, res, next) {
    res.locals.assets = assets;

    mean.aggregated('js', 'header', function(data) {
      res.locals.headerJs = data;
      next();
    });
  });

  // Express/Mongo session storage
  app.use(session({
    secret: config.sessionSecret,
    store: new mongoStore({
      db: db.connection.db,
      collection: config.sessionCollection
    }),
    cookie: config.sessionCookie,
    name: config.sessionName,
    resave: true,
    saveUninitialized: true
  }));

  //静态文件目录
  app.use('/dist', express.static(config.root + '/dist'));
  // Dynamic helpers
  app.use(helpers(config.app.name));

  // Use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  //mean middleware from modules before routes
  app.use(mean.chainware.before);

  // Connect flash for flash messages
  app.use(flash());
};
