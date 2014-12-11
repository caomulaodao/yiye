/**
 * Created by laodao on 14-10-15.
 */
// add md5
!function(a){"use strict";function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define(function(){return t}):a.md5=t}(this);

//app
$(function(){
    var cdnUrl = "http://yiye.qiniudn.com/";

    //新频道model
    var NewChannel = Backbone.Model.extend({
        url:"/api/channels/create",
        validate: function(attrs, options) {
            if (!attrs.name ) {
                return "请填写频道名称。";
            }
            if (!attrs.logo ) {
                return "请上传频道logo。";
            }
            if (!attrs.description ) {
                return "请填写频道描述。";
            }
            if (!attrs.type ) {
                return "请选择频道分类。";
            }
            if (!attrs.tags ) {
                return "请为频道填写相关标签。";
            }
        }
    });

    //bookmarkLike
    var bkLike = Backbone.Model.extend({

    });

    //bookmarkHate
    var bkHate = Backbone.Model.extend({

    });

    //bookmarkList bookmodel
    var bkListInit = Backbone.Model.extend({
        //url:"/api/bookmarks/list"
    });

    //channel top list model
    var channelShowcase = Backbone.Model.extend({
        defaults: {number: 1}    //Ajax加载次数
    });

    //新消息model
    var newMessage = Backbone.Model.extend({
        defaults: {number: 1}    //Ajax加载次数
    });

    //历史消息model
    var hisMessage = Backbone.Model.extend({
        defaults: {number: 1}    //Ajax加载次数
    });

    //审核model
    var checkMsg = Backbone.Model.extend({
        defaults: {number: 0}
    });
    //通知model
    var informMsg = Backbone.Model.extend({
        defaults: {number: 0}
    });
    //关注model
    var attentionMsg = Backbone.Model.extend({
        defaults: {number: 0}
    });
    //点赞model
    var praiseMsg = Backbone.Model.extend({
        defaults: {number: 0}
    });


    var channelList = Backbone.Model.extend({
    });

    //订阅频道model
    var subChannelModel= Backbone.Model.extend({
    });

    //home页频道书签加载
    var newBookmarkModel = Backbone.Model.extend({

    });



    //书签列表视图
    var listView = Backbone.View.extend({
        el: $('.content-page'),

        initTemplate: _.template($('#tp-channels-main').html()),

        lock:{
            bkUp:false,
            bkDown:false
        },

        initialize: function(){
        },

        events:{
            "click .up" : "bkUp",
            "click .down": "bkDown"
        },

        render: function(channelId){
            var that = this;
            that.list = new bkListInit;
            that.list.fetch({
                url:'/api/bookmarks/init?channelId='+channelId,
                success:function(model,response){
                    if(response.code==0){
                        that.$el.html(that.initTemplate(response.data));
                        that.list.date = response.data.nextTime;
                        that.list.channelId =  response.data.info._id;
                        that.renderAfter();
                    }
                    else{
                        console.log(response);
                    }
                }
            })
        },

        renderAfter : function(){
            var that = this;
            that.channelAjax.bScroll = true; //许可Ajax加载
            $(".content-page-content").scroll(function(){
                that.channelAjax();
            });
        },

        channelAjax: function() {
            var that = this;
            var nClientH = $(window).height();
            var nScrollTop = $('.content-page-content').scrollTop();
            var nChannelH = $('.content-body').height();
            if((nClientH + nScrollTop + 100 >= nChannelH) && (that.channelAjax.bScroll == true)) {
                that.channelAjax.bScroll = false;   //禁止Ajax加载
                var sDate = that.list.date;
                var sChannelId = that.list.channelId;
                that.list.fetch({
                    data: {date: sDate, channelId: sChannelId},
                    url: "/api/home/bookmark",
                    success: function(model, response){
                        if (response.code==0){
                            $('.content-body>ul').append(that.channelTemplate(response.data));
                            if(!response.data.isHave){
                                $('.content-body>ul').append("<p class='no-news'>无新内容了</p>");
                            } else {
                                var nextDate = response.data.nextTime;   //将下次日期赋值给nextDate变量
                                that.list.set("date", nextDate);         //记录下次Ajax日期
                                that.channelAjax.bScroll = true;         //许可Ajax加载
                            }                           
                        }
                        else{
                            console.log(response);
                        }

                    }
                });
            }
        },

        channelTemplate: _.template($('#tp-bookmarks-oneday').html()),

        bkUp: function(event){
            if(this.lock.bkUp) return false;
            this.lock.bkUp = true;
            var like = new bkLike;
            var bookmarkId = $(event.currentTarget).data('bookmarkid');
            var that = this;
            like.fetch({url:'/api/bookmarks/like/'+bookmarkId,success:function(model,response){
                if (response.code==0){
                    if(response.data.isLiked == false){
                        var count = $(event.currentTarget).find('span');
                        count.text(+count.text()+1);
                    }
                    that.lock.bkUp = false;  
                }
                else{
                    console.log(response);
                }

            }})
        },

        bkDown: function(event){
            if(this.lock.bkDown) return false;
            this.lock.bkDown = true;
            var hate = new bkHate;
            var bookmarkId = $(event.currentTarget).data('bookmarkid');
            var that = this;
            hate.fetch({url:'/api/bookmarks/hate/'+bookmarkId,success:function(model,response){
                if (response.code==0){
                    if(response.data.isLiked == true && response.data.isHated == false){
                        var count = $(event.currentTarget).parent().find('span');
                        count.text(+count.text()-1);
                    }
                    that.lock.bkDown = false;  
                }
                else{
                    console.log(response);
                }

            }})
        }
    });

    //创建频道视图
    var NewChannelView = Backbone.View.extend({
        el: $('#tp-create-channels').html(),

        channel : new NewChannel(),

        layer: $('#content-page'),

        layerShadow: $('.shadow'),

        initialize: function() {
            this.channel.on("invalid", function(model, error) {
                $('#Channel-Create-Error').text(error).show();
            });
        },

        events:{
            "click #channel-create-button" :"createChannel"
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
                max_file_size: '2mb',
                flash_swf_url: '/bower_components/js/plupload/Moxie.swf',
                dragdrop: true,
                chunk_size: '1mb',
                uptoken_url: "/uptoken",
                domain: "http://yiye.qiniudn.com/",
                auto_start: true,
                init: {
                    'Key': function(up,file,info){
                        return  "cLogo/"+(md5(Math.floor(Math.random()*10000))).slice(0,16)+(md5(file.name+Date.now())).slice(0,16)+".png";
                    },
                    'FilesAdded': function(){
                        $('#channel-create-logo').addClass('upLoading');
                    },
                    'FileUploaded': function(up, file, info) {
                        var info  = JSON.parse(info);
                        var logo = info.key;
                        that.channel.set({logo : logo});
                        $('#channel-logo').attr('src',cdnUrl+logo);
                        $('#channel-create-logo').removeClass('upLoading');
                    },
                    'Error': function(up, err, errTip) {
                        console.log(err);
                    }
                }
            });

        },

        //创建频道
        createChannel: function(){
            var that = this;
            this.channel.set({name : $('#channel-create-name>input').val()});
            this.channel.set({description : $('#channel-create-description>textarea').val()});
            this.channel.set({tags : $('#channel-create-tags>input').val()});
            this.channel.set({type: $("input[name='type']:checked").val()});
            this.channel.set({banner: 'channels/assets/img/background/cBg0' + (Math.ceil(Math.random()*10)) + '.png'});
            this.channel.save(null,{error: function(model, response){
                $('#Channel-Create-Error').text('网络异常').show();
            },success: function(model, response){
                if(response.code == 0) {
                    popup("频道创建成功 ！");
                    setTimeout(function(){
                        location.href = '/home';
                    },1000);
                } else {
                    popup(response.msg);
                }                
            }});
        }

    });


    //用户个人中心视图
    /*
    var PersonView = Backbone.View.extend({
        el: $('#tp-personal-center').html(),

        layer: $('#home-popup-layer'),

        lock: {
            info: false,
            password: false,
            viewed: false
        },

        layerShadow: $('.shadow'),

        //向视图绑定事件
        events: {
            'click #user-info-button': "upUserInfo",
            'click #password-change-button': "changePassword",
            'click .sure': "viewed",
            'click #news-tab': 'newMessage',
            'click #history-tab': "history"
        },

        initialize: function () {
        },

        render: function () {
            return this;
        },

        newMesTemplate: _.template($('#tp-user-news').html()),

        historyTemplate: _.template($('#tp-user-history').html()),


        renderAfter: function () {
            //频道logo上传
            var that = this;
            var cgChLogoUploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',
                browse_button: 'change-user-logo',
                max_file_size: '2mb',
                flash_swf_url: '/bower_components/js/plupload/Moxie.swf',
                dragdrop: true,
                chunk_size: '1mb',
                uptoken_url: "/uptoken",
                domain: "http://yiye.qiniudn.com/",
                auto_start: true,
                init: {
                    'Key': function (up, file, info) {
                        return  "avatar/" + (md5(Math.floor(Math.random() * 10000))).slice(0, 16) + (md5(file.name + Date.now())).slice(0, 16) + ".png";
                    },
                    'FilesAdded': function () {
                        $('#user-info-logo').addClass('upLoading');
                    },
                    'FileUploaded': function (up, file, info) {
                        var info = JSON.parse(info);
                        var logo = info.key;
                        $('#user-change-logo').attr('src', cdnUrl + logo);
                        $('#user-info-logo').removeClass('upLoading');
                    },
                    'Error': function (up, err, errTip) {
                        console.log(err);
                    }
                }
            });
        },


        upUserInfo: function () {
            var user = {};
            user.avatar = $('#user-change-logo').attr('src').split(".com/")[1];
            user.intro = $('#user-info-intro>textarea').val();
            var that = this;
            if (!that.lock.info) {
                that.lock.info = true;
                $.ajax({
                    url: '/api/account/update',
                    type: 'post',
                    data: user,
                    success: function (response) {
                            //结果提示
                                if(response.code==0){
                                    popup('个人信息更新成功');
                                }
                                else{
                                    popup(response.msg);
                                }                         
                                that.lock.info = false;
                            }                  
                });
            }
        },

        changePassword: function () {
            if (!$('#user-current-password').val()) {
                return $('#User-Change-Error').text('请先填写当前密码').show();
            }
            if (!$('#user-new-password').val()) {
                return $('#User-Change-Error').text('请填写新密码').show();
            }
            if (!$('#user-repeat-password').val()) {
                return $('#User-Change-Error').text('请填写确认密码密码').show();
            }
            if ($('#user-repeat-password').val() !== $('#user-new-password').val()) {
                return $('#User-Change-Error').text('新的密码与确认密码不同').show();
            }
            var password = {};
            password.new = $('#user-new-password').val();
            password.old = $('#user-current-password').val();
            var that = this;
            if (!that.lock.password) {
                that.lock.password = true;
                $.ajax({
                    url: '/api/account/changePassword',
                    type: 'post',
                    data: password,
                    success:function(response){
                        if (response.code==0){
                            popup('密码修改成功');
                        }
                        else {
                            $('#User-Change-Error').text(response.msg).show();
                        }
                        that.lock.password = false;
                    }
                });
            }

        },

        viewed: function (event) {
            var bookmarkId = $(event.target).data('bookmarkid');
            var index = $(event.target).data('index');
            var that = this;
            if (!that.lock.viewed) {
                that.lock.viewed = true;
                $.ajax({
                    url: '/api/news/viewed',
                    type: 'post',
                    data: {bookmarkId: bookmarkId},
                    success:function(response){
                        if (response.code==0){
                            var num = $('#news-tab').data('num') -1;
                            $('#news-'+index).remove();
                            if (num>0){
                                $("#news-tab").data('num', num)
                                $("#news-tab").text("新消息(" + num + ")");
                                $("#news-popup-num").text(num);
                            }
                            else{
                                $('#news-tab').text('新消息');
                                $('#news-popup-num').remove();
                            }
                        }
                        else {
                            console.log(response);
                        }
                        that.lock.viewed = false;
                    }
                });
            }
        },

        newMessage: function () {
            var that = this;
            that.newMes = new newMessage;
            that.newMes.fetch({
                url: 'api/home/newmes',
                data: {'number': 1},
                success: function (model, response) {
                    if (response.code==0){
                        $('.user-news-list').html(that.newMesTemplate(response.data));
                        that.newMes.set('number', 2);                      
                    }
                    else{
                        console.log(response);
                    }

                }
            });

            that.newMesAjax.bScroll = true;   //许可Ajax加载
            $('.content-page').scroll(function () {
                that.newMesAjax();
            });
        },

        history: function () {
            var that = this;
            that.hisMes = new hisMessage;
            that.hisMes.fetch({
                url: '/api/home/hismes',
                data:{'number':1},
                success: function (model, response) {
                    if(response.code==0){
                        $('.user-history-list').html(that.historyTemplate(response.data));
                        that.hisMes.set('number',2);                      
                    }
                    else{
                        console.log(response);
                    }
                }
            });
            that.hisMesAjax.bScroll = true;    //许可Ajax加载
            $('.content-page').scroll(function () {
                that.hisMesAjax();
            });
        },

        newMesAjax: function () {
            var that = this;
            var nClientH = $(window).height();
            var nScrollTop = $('.content-page').scrollTop();
            var nChannelH = $('.personal-center').height();
            if ((nClientH + nScrollTop >= nChannelH) && (that.newMesAjax.bScroll == true)) {
                that.newMesAjax.bScroll = false;   //禁止Ajax加载
                var nNum = that.newMes.get("number");
                that.newMes.fetch({
                    data: {number: nNum},
                    url: "/api/home/newmes",
                    success: function (model, response) {
                        if (response.code==0){
                            $('.user-news-list').append(that.newMesTemplate(response.data));
                            if (!response.data.isHave) {
                                $('.user-news-list').append("<p class='no-news'>无新内容了</p>");
                            } else {
                                that.newMes.set("number", ++nNum);
                                that.newMesAjax.bScroll = true;     //许可Ajax加载
                            }                            
                        }
                        else{
                            console.log(response);
                        }
                    }
                });
            }
        },

        hisMesAjax: function () {
            var that = this;
            var nClientH = $(window).height();                  
            var nScrollTop = $('.content-page').scrollTop();   
            var nChannelH = $('.personal-center').height();     
            if ((nClientH + nScrollTop >= nChannelH) && (that.hisMesAjax.bScroll == true)) {
                that.hisMesAjax.bScroll = false;     //禁止Ajax加载
                var nNum = that.hisMes.get('number');
                that.hisMes.fetch({
                    data: {number: nNum},
                    url: "/api/home/hismes",
                    success: function (model, response) {
                        if (response.code==0){
                            $('.user-history-list').append(that.historyTemplate(response.data));
                            if (!response.data.isHave) {
                                $('.user-history-list').append("<p class='no-news'>无新内容了</p>");
                            } else {
                                that.hisMes.set("number", ++nNum);
                                that.hisMesAjax.bScroll = true;     //许可Ajax加载
                            }                           
                        }
                        else {
                            console.log(response);
                        }   
                    }
                });
            }
        }
    });
    */
    

    //消息界面（审核，通知，关注，赞）
    var MessageView = Backbone.View.extend({
        el: $('#tp-message-check').html(),

        layer: $('#home-popup-layer'),

        lock: {
            info: false,
            viewed: false
        },

        layerShadow: $('.shadow'),

        //向视图绑定事件
        events: {
            'click #check-btn' : 'check',
            'click #inform-btn' : 'inform',
            'click #attention-btn' : 'attention',
            'click #praise-btn' : 'praise',
            'touch #check-btn' : 'check',
            'touch #inform-btn' : 'inform',
            'touch #attention-btn' : 'attention',
            'touch #praise-btn' : 'praise'
        },

        initialize: function () {
        },

        render: function () {
            return this;
        },

        checkTemplate: _.template($('#tp-user-check').html()),

        informTemplate: _.template($('#tp-user-inform').html()),

        attentionTemplate: _.template($('#tp-user-attention').html()),

        praiseTemplate: _.template($('#tp-user-praise').html()),

        renderAfter: function () {
            //频道logo上传
            var that = this;
            var cgChLogoUploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',
                browse_button: 'change-user-logo',
                max_file_size: '2mb',
                flash_swf_url: '/bower_components/js/plupload/Moxie.swf',
                dragdrop: true,
                chunk_size: '1mb',
                uptoken_url: "/uptoken",
                domain: "http://yiye.qiniudn.com/",
                auto_start: true,
                init: {
                    'Key': function (up, file, info) {
                        return  "avatar/" + (md5(Math.floor(Math.random() * 10000))).slice(0, 16) + (md5(file.name + Date.now())).slice(0, 16) + ".png";
                    },
                    'FilesAdded': function () {
                        $('#user-info-logo').addClass('upLoading');
                    },
                    'FileUploaded': function (up, file, info) {
                        var info = JSON.parse(info);
                        var logo = info.key;
                        $('#user-change-logo').attr('src', cdnUrl + logo);
                        $('#user-info-logo').removeClass('upLoading');
                    },
                    'Error': function (up, err, errTip) {
                        console.log(err);
                    }
                }
            });
        },

        //审核tab
        check: function() {
            var that = this;            
            that.checkMsg = new checkMsg;
            that.checkMsg.fetch({
                url: 'api/home/checkmsg',
                data: {'number': 1},
                success: function (model, response) {
                    if (response.code == 0){
                        $('.user-check-list').html(that.checkTemplate(response.data));
                        that.checkMsg.set('number', 2);   //设置下次加载的number （滚动ajax加载）                  
                    }
                    else{
                        console.log(response);
                    }
                }
            });

            that.checkAjax.bScroll = true;   //许可Ajax加载
            $('.content-page').scroll(function () {
                that.checkAjax();
            });
        },

        //通知tab
        inform: function() {
            var that = this;            
            that.informMsg;
            that.informMsg.fetch({
                url: 'api/home/callmsg',
                data: {'number': 1},
                success: function (model, response) {
                    if (response.code == 0){
                        $('.user-inform-list').html(that.informTemplate(response.data));
                        that.informMsg.set('number', 2);   //设置下次加载的number （滚动ajax加载）                  
                    }
                    else{
                        console.log(response);
                    }
                }
            });

            that.infromAjax.bScroll = true;   //许可Ajax加载
            $('.content-page').scroll(function () {
                that.informAjax();
            });
        },


        checkAjax: function() {
            var that = this;
            var nClientH = $(window).height();                  
            var nScrollTop = $('.content-page').scrollTop();   
            var nChannelH = $('.personal-center').height();     
            if ((nClientH + nScrollTop >= nChannelH) && (that.checkAjax.bScroll == true)) {
                that.checkAjax.bScroll = false;     //禁止Ajax加载
                var nNum = that.checkMsg.get('number');
                that.checkMsg.fetch({
                    data: {number: nNum},
                    url: "/api/home/checkmsg",
                    success: function (model, response) {
                        if (response.code==0){
                            $('.user-check-list').append(that.checkTemplate(response.data));
                            if (!response.data.isHave) {
                                $('.user-check-list').append("<p class='no-news'>无新内容了</p>");
                            } else {
                                that.checkMsg.set("number", ++nNum);
                                that.checkAjax.bScroll = true;     //许可Ajax加载
                            }                           
                        }
                        else {
                            console.log(response);
                        }   
                    }
                });
            }
        },

        informAjax: function() {
            var that = this;
            var nClientH = $(window).height();                  
            var nScrollTop = $('.content-page').scrollTop();   
            var nChannelH = $('.personal-center').height();     
            if ((nClientH + nScrollTop >= nChannelH) && (that.informAjax.bScroll == true)) {
                that.informAjax.bScroll = false;     //禁止Ajax加载
                var nNum = that.informMsg.get('number');
                that.informMsg.fetch({
                    data: {number: nNum},
                    url: "/api/home/callmsg",
                    success: function (model, response) {
                        if (response.code==0){
                            $('.user-check-list').append(that.checkTemplate(response.data));
                            if (!response.data.isHave) {
                                $('.user-check-list').append("<p class='no-news'>无新内容了</p>");
                            } else {
                                that.informMsg.set("number", ++nNum);
                                that.checkAjax.bScroll = true;     //许可Ajax加载
                            }                           
                        }
                        else {
                            console.log(response);
                        }   
                    }
                });
            }
        }

    });


    //设置界面
    var Setting = Backbone.View.extend({
        el: $('#tp-personal-setting').html(),

        layer: $('#home-popup-layer'),
        lock: {
            info: false,
            password: false,
            viewed: false
        },
        layerShadow: $('.shadow'),
        initialize: function() {
            this.channel.on("invalid", function(model, error) {
                $('#Channel-Create-Error').text(error).show();
            });
        },
        events: {
            'click #user-info-button': "upUserInfo",
            'click #password-change-button': "changePassword",
            'click .sure': "viewed",
        },
        initialize: function () {
        },

        render: function () {
            return this;
        },  

        renderAfter: function () {
            //频道logo上传
            var that = this;
            var cgChLogoUploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',
                browse_button: 'change-user-logo',
                max_file_size: '2mb',
                flash_swf_url: '/bower_components/js/plupload/Moxie.swf',
                dragdrop: true,
                chunk_size: '1mb',
                uptoken_url: "/uptoken",
                domain: "http://yiye.qiniudn.com/",
                auto_start: true,
                init: {
                    'Key': function (up, file, info) {
                        return  "avatar/" + (md5(Math.floor(Math.random() * 10000))).slice(0, 16) + (md5(file.name + Date.now())).slice(0, 16) + ".png";
                    },
                    'FilesAdded': function () {
                        $('#user-info-logo').addClass('upLoading');
                    },
                    'FileUploaded': function (up, file, info) {
                        var info = JSON.parse(info);
                        var logo = info.key;
                        $('#user-change-logo').attr('src', cdnUrl + logo);
                        $('#user-info-logo').removeClass('upLoading');
                    },
                    'Error': function (up, err, errTip) {
                        console.log(err);
                    }
                }
            });
        },


        upUserInfo: function () {
            var user = {};
            user.avatar = $('#user-change-logo').attr('src').split(".com/")[1];
            user.intro = $('#user-info-intro>textarea').val();
            var that = this;
            if (!that.lock.info) {
                that.lock.info = true;
                $.ajax({
                    url: '/api/account/update',
                    type: 'post',
                    data: user,
                    success: function (response) {
                            //结果提示
                                if(response.code==0){
                                    popup('个人信息更新成功');
                                }
                                else{
                                    popup(response.msg);
                                }                         
                                that.lock.info = false;
                            }                  
                });
            }
        },

        changePassword: function () {
            if (!$('#user-current-password').val()) {
                return $('#User-Change-Error').text('请先填写当前密码').show();
            }
            if (!$('#user-new-password').val()) {
                return $('#User-Change-Error').text('请填写新密码').show();
            }
            if (!$('#user-repeat-password').val()) {
                return $('#User-Change-Error').text('请填写确认密码密码').show();
            }
            if ($('#user-repeat-password').val() !== $('#user-new-password').val()) {
                return $('#User-Change-Error').text('新的密码与确认密码不同').show();
            }
            var password = {};
            password.new = $('#user-new-password').val();
            password.old = $('#user-current-password').val();
            var that = this;
            if (!that.lock.password) {
                that.lock.password = true;
                $.ajax({
                    url: '/api/account/changePassword',
                    type: 'post',
                    data: password,
                    success:function(response){
                        if (response.code==0){
                            popup('密码修改成功');
                        }
                        else {
                            $('#User-Change-Error').text(response.msg).show();
                        }
                        that.lock.password = false;
                    }
                });
            }

        },                  
    });

    //用户发现页面
    var ExploreView = Backbone.View.extend({
        url: "/api/home/discover",

        el: $('.content-page'),

        initTemplate: _.template($('#tp-channel-explore').html()),

        addTemplate: _.template($('#tp-channel-explore-ul').html()),

        events: {
            'click .to-sub': "subChannelAjax"
        },

        initialize: function() {
        },

        render: function(){
            var that = this;
            that.cList = new channelShowcase;
            that.cList.fetch({url:'/api/home/discover',success:function(model,response){
                if (response.code==0){
                    that.$el.html(that.initTemplate(response.data));
                    that.cList.set("number", 2);
                    $('.ex-creator').tooltip();    //创建者头像绑定tooltip
                    that.renderAfter();
                }
                else{
                    console.log(response);
                }
            }})
        },

        renderAfter: function(){
            var that = this;
            that.exploreAjax.bScroll = true; //许可Ajax加载
            $("#channel-explore").scroll(function(){
                that.exploreAjax();
            });
        },

        //Ajax加载频道内容
        exploreAjax: function() {
            var that = this;
            var nClientH = $(window).height();
            var nScrollTop = $('#channel-explore').scrollTop();
            var nChannelH = $('#channel-explore ul').height();
            if((nClientH + nScrollTop - 80 >= nChannelH) && (that.exploreAjax.bScroll == true)) {
                that.exploreAjax.bScroll = false;   //禁止Ajax加载
                var nNum = that.cList.get('number');
                that.cList.fetch({
                    data: {number: nNum},
                    url: "/api/home/discover",
                    success: function(model, response){
                        if (response.code==0){
                            $('#channel-explore ul').append(that.addTemplate(response.data));
                            $('.ex-creator').tooltip();        //创建者头像绑定tooltip
                            if(!response.data.isHave){
                                $('#channel-explore ul').append("<p class='no-news'>无新内容了</p>");
                            } else {
                                that.cList.set("number",++nNum);
                                that.exploreAjax.bScroll = true;     //许可Ajax加载
                            }                           
                        }
                        else{
                            console.log(response);
                        }
                    },
                    error: function() {
                        console.log('exploreAjaxError');
                        that.exploreAjax.bScroll = true;     //许可Ajax加载
                    }
                });
            }
        },

        //Ajax点击链接订阅频道
        subChannelAjax: function(event) {
            var that = this;
            var channelId = $(event.currentTarget).data('id');
            var subChannel = new subChannelModel;
            subChannel.save({},{
                url: "/channel/sub/"+ channelId,
                success: function(model, response) {
                    if (response.code==0){
                        $(event.currentTarget).html('已订阅');
                        $(event.currentTarget).addClass('have-subed').removeClass('to-sub');                       
                    }
                    else{
                        console.log(response);
                    }
                }
            });
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
            'click .create-channel>button' : "createChannels",//创建频道
            'click #admin-channel-list li' : 'showChannel',
            'click #sub-channel-list li' : 'showChannel',
            'click #explore' : 'showExplore',
            'click .subscription' : 'showSubscription',//展示订阅频道
            'touch .subscription' : 'showSubscription',
            'click .administration' : 'showAdministration',//展示管理频道
            'touch .administration' : 'showAdministration',
            'click .channel-item' :'showSubBkm',//订阅频道的书签
            'touch .channel-item' :'showSubBkm',
            'click #message' : 'showMessage',//消息界面
            'touch #message' : 'showMessage',
            'click #discover' : 'showDiscover',//发现界面
            'touch #discover' : 'showDiscover',
            'click #help' :'showHelp',//帮助页面
            'touch #help' :'showHelp',
            'click #set' :'showSet',//设置界面
            'touch #set' :'showSet'
        },

        initialize: function() {
            if (window.location.href.indexOf('#')>-1){
                return;
            }
            this.showExplore();
        },

        //展示创建频道弹出页
        createChannels : function(){
            // var view = new NewChannelView();
            // this.main.html(view.render().el);
            // view.renderAfter();
            Router.navigate('create',true);
        },

        //展示频道
        showChannel : function(event){
            var channelId = $(event.currentTarget).data('id');
            var list = new listView;
            list.render(channelId);
        },

        //展示发现页面
        showExplore : function(){
            var explore = new ExploreView();
            explore.render();
        },
        //展示管理频道
        showAdministration : function(){
            Router.navigate('manage',true);
        },
        //展示订阅频道
        showSubscription : function(){
            Router.navigate('sub',true);
        },
        //展示对应频道里面的书签
        showSubBkm : function(event){
            Router.navigate('channel/'+$(event.currentTarget).data('id'),true);
        },
        //展示消息
        showMessage : function(){
            Router.navigate('message',true);
        },
        //展示发现界面
        showDiscover : function(){
            Router.navigate('discover',true);
        },
        //帮助页面
        showHelp : function(){
            Router.navigate('help',true);
        },
        //设置界面
        showSet : function(){
            Router.navigate('set',true);
        }
    });

    //实例化
    var App = new AppView;

        //爱屁屁的路由
    var AppRouter = Backbone.Router.extend({
        routes:{
            'sub' : 'subControl',
            'sub/:channelId' : 'channelControl',
            'manage' : 'manage',
            'channel/:channelId' : 'channelBookmarks',
            'create' : 'create',
            'message' : 'message',
            'discover' : 'discover',
            'help' : 'help',
            'set' : 'set',
        },
        defaultRoute : function(){
        },
        subControl : function(){
            $('.subscription').addClass('active').next().removeClass('active');
            $('.channel-list').show().next().hide();
        },
        manage : function(){
            $('.administration').addClass('active').prev().removeClass('active');
            $('.admin-interface').show().prev().hide();
        },
        channelBookmarks : function(id){
            var dataId = id;
            $('.channel-item').removeClass('active');
            $('.channel-item[data-id='+ dataId +']').addClass('active');
        },
        create : function(){
            var view = new NewChannelView();
            App.main.html(view.render().el);
            view.renderAfter();
        },
        message: function(){
            //消息部分
            var view = new MessageView();
            App.main.html(view.render().el);
            view.renderAfter();
        },
        discover: function(){
            var view = new ExploreView();
            App.main.html(view.render());
            view.renderAfter();
        },
        help: function(){

        },
        set: function(){
            var view = new Setting();
            App.main.html(view.render().el);
            view.renderAfter();
        }


    })
    var Router = new AppRouter;
    Backbone.history.start();


    //消息提示函数
    function popup(info){
        $('#result-dialog-content').text(info);
        $('#result-dialog').modal('show');
        setTimeout(function(){
            $('#result-dialog').modal('hide');
        },2000);
    }


});