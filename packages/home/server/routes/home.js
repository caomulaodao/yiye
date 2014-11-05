'use strict';

// The Package is past automatically as first parameter
module.exports = function(Home, app, auth, database) {

    var home = require('../controllers/home.js');
    app.get('/home',function (req,res,next){
        if(!req.user) res.redirect('/');
        home.getInitChannels(req,res,Home);
    });
    app.post('/api/channels/create',home.createChannel);
    //获取用户所有相关频道
    app.route('/api/channel/all')
        .get(home.getChannelsList);
};
