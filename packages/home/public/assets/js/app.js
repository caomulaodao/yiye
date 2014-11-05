/**
 * Created by laodao on 14-10-15.
 */
// add md5
!function(a){"use strict";function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define(function(){return t}):a.md5=t}(this);

//app
$(function(){

    //新频道model
    var NewChannel = Backbone.Model.extend({
        url:"/api/channels/create"
    });

    //bookmarkLike
    var bkLike = Backbone.Model.extend({

    })

    //bookmarkHate
    var bkHate = Backbone.Model.extend({

    });


    //bookmarkList bookmodel
    var bkListInit = Backbone.Model.extend({
        //url:"/api/bookmarks/list"
    });


    var listView = Backbone.View.extend({
        el: $('.content-page'),

        initTemplate: _.template($('#tp-channels-main').html()),

        lock:{
            bkUp:false,
            bkDown:false
        },

        initialize: function() {
        },

        events:{
            "click .up" :"bkUp",
            "click .down":"bkDown"
        },

        render: function(channelId){
            var list = new bkListInit;
            var that = this;
            list.fetch({url:'/api/bookmarks/init/'+channelId,success:function(model,response){
                that.$el.html(that.initTemplate(response));
            }})
        },

        bkUp: function(event){
            if(this.lock.bkUp) return false;
            this.lock.bkUp = true;
            var like = new bkLike;
            var bookmarkId = $(event.currentTarget).data('bookmarkid');
            var that = this;
            like.fetch({url:'/api/bookmarks/like/'+bookmarkId,success:function(model,response){
                if(response.success){
                    var count = $(event.currentTarget).find('span');
                    count.text(+count.text()+1);
                }
                that.lock.bkUp = false;
            }})
        },

        bkDown: function(event){
            if(this.lock.bkDown) return false;
            this.lock.bkDown = true;
            var hate = new bkHate;
            var bookmarkId = $(event.currentTarget).data('bookmarkid');
            var that = this;
            hate.fetch({url:'/api/bookmarks/hate/'+bookmarkId,success:function(model,response){
                if(response.success){

                }
                that.lock.bkDown = false;
            }})
        }
    });

    //创建频道视图
    var NewChannelView = Backbone.View.extend({
        el: $('#tp-create-channels').html(),

        channel : new NewChannel(),

        layer: $('#home-popup-layer'),

        layerShadow: $('.shadow'),

        initialize: function() {
        },

        events:{
            "click .classify input" :"choseType",
            "click .finish-channel" :"createChannel",
            "click .close-icon" :"closeLayer"
        },

        render: function(){
            return this;
        },

        //后续工作
        renderAfter: function(){
            //频道logo上传
            var that = this;
            var cgChLogoUploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',
                browse_button : 'change-channel-logo',
                max_file_size: '1mb',
                flash_swf_url: '/bower_components/js/plupload/Moxie.swf',
                dragdrop: true,
                chunk_size: '1mb',
                uptoken_url: "/uptoken",
                domain: "http://yiye.qiniudn.com/",
                auto_start: true,
                init: {
                    'Key': function(up,file,info){
                        console.log(file);
                        return  "cLogo/"+(md5(Math.floor(Math.random()*10000))).slice(0,16)+(md5(file.name+Date.now())).slice(0,16)+".png";
                    },
                    'FilesAdded': function(){
                        $('.channel-logo').addClass('upLoading');
                    },
                    'FileUploaded': function(up, file, info) {
                        var info  = JSON.parse(info);
                        var logo = "http://yiye.qiniudn.com/"+info.key;
                        console.log(logo)
                        that.channel.set({logo : logo});
                        $('#channel-logo').attr('src',logo);
                        $('.channel-logo').removeClass('upLoading');
                    },
                    'Error': function(up, err, errTip) {
                        console.log(err);
                    }
                }
            });
            //频道banner上传
            var cgChbannerUploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',
                browse_button : 'change-channel-banner',
                max_file_size: '1mb',
                flash_swf_url: '/bower_components/js/plupload/Moxie.swf',
                dragdrop: true,
                chunk_size: '1mb',
                uptoken_url: "/uptoken",
                domain: "http://yiye.qiniudn.com/",
                auto_start: true,
                init: {
                    'Key': function(up,file,info){
                        console.log(file);
                        return  "cBanner/"+(md5(Math.floor(Math.random()*10000))).slice(0,16)+(md5(file.name+Date.now())).slice(0,16)+".png";
                    },
                    'FilesAdded': function(){
                        $('#channel-header').addClass('upLoading');
                    },
                    'FileUploaded': function(up, file, info) {
                        var info  = JSON.parse(info);
                        var banner = "http://yiye.qiniudn.com/"+info.key;
                        that.channel.set({banner : banner});
                        $('#channel-header').css({"background-image":"url("+banner+")","background-size":"cover"});
                        $('#channel-header').removeClass('upLoading');
                    },
                    'Error': function(up, err, errTip) {
                        console.log(err);
                    }
                }
            });
        },

        //频道选择类型
        choseType: function(e){
            $('.classify input').removeClass('chosen');
            $(event.currentTarget).addClass('chosen');
            this.channel.set({type : $(event.currentTarget).attr('name')});
        },

        //创建频道
        createChannel: function(){
            var that = this;
            this.channel.set({name : $('#new-channel-name').val()});
            this.channel.set({description : $('#new-channel-description').val()});
            this.channel.set({tags : $('#new-channel-tags').val()});
            this.channel.save(null,{error: function(model, response){
                console.log('error'+response);
            },success: function(model, response){
                that.closeLayer();
            }});
        },

        //关闭弹出层
        closeLayer: function(){
            this.layerShadow.hide();
            this.layer.html('');
        }

    });


    //用户个人中心视图
    var PersonView = Backbone.View.extend({
        el: $('#tp-personal-center').html(),

        layer: $('#home-popup-layer'),

        layerShadow: $('.shadow'),

        initialize: function() {
        },

        render: function(){
            return this;
        }

    });

    //主视图
    var AppView = Backbone.View.extend({

        el: $('.control-page'),

        createChannelsTPL: _.template($('#tp-create-channels').html()),

        layer: $('#home-popup-layer'),

        layerShadow: $('.shadow'),

        main: $('.content-page'),


        //向主视图绑定事件
        events: {
            'click .create-channel>button' : "createChannels",
            'click #user-center' : "showPerson",
            'click #admin-channel-list  li' : 'showChannel',
            'click #sub-channel-list  li' : 'showChannel'
        },

        //展示创建频道弹出页
        createChannels : function(){
            this.layerShadow.show();
            var view = new NewChannelView();
            this.layer.html(view.render().el);
            view.renderAfter();
        },

        //展示用户个人中心弹出层
        showPerson : function(){
            this.layerShadow.show();
            var view = new PersonView();
            this.layer.html(view.render().el);
            //view.renderAfter();
        },

        //展示频道
        showChannel : function(event){
            var channelId = $(event.currentTarget).data('id');
            var list = new listView;
            list.render(channelId);
        }
    });

    //实例化
    var App = new AppView;


});