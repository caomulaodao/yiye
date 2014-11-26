/**
 * Created by laodao on 14/11/5.
 */

// add md5
!function(a){"use strict";function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define(function(){return t}):a.md5=t}(this);

$(window).load(function() {
    initialize();
    uploadLogo();
});
//点击锁
var lock = {
    pass:false,
    edit:false,
    delete:false,
    update:false
};

var cdnUrl = "http://yiye.qiniudn.com/";

function initialize() {
    //通过某个书签 弹出确认对话框
    $('.passBookmark').click(function(event){
        var index = $(event.target).data('index');
        var title = $('.link-'+index).text();
        var bookmarkid = $('.footer-'+index).data('bookmarkid');
        var channelTitle = $('#channel-title').text();
        $('#pass-bookmark-title').text(title);
        $('#pass-to-channel').text(channelTitle);
        $('#pass-confirm-ok').data('bookmarkid',bookmarkid);
        $('#pass-confirm-ok').data('index',index);
        $('#pass-confirm-box').modal('show');
    });

    //确认通过当前的书签
    $('#pass-confirm-ok').click(function(event){
        var bookmarkId = $('#pass-confirm-ok').data('bookmarkid');
        var index =   $('#pass-confirm-ok').data('index');
        var channelId = $('#control-body').data('channelid');
        if(!lock.pass){
            lock.pass = true;
            $.ajax({
                url: '/api/bookmarks/pass/'+channelId+'/'+bookmarkId,
                type:'post',
                statusCode: {
                    401: function() {
                        $('#pass-confirm-box').modal('hide');
                        //结果提示
                        $('#result-dialog').modal('show');
                        setTimeout(function(){
                            $('#result-dialog').modal('hide');
                        },2000);

                        lock.pass = false;
                    },
                    200: function(){
                        $('#pass-confirm-box').modal('hide');
                        //结果提示
                        $('#result-dialog').modal('show');
                        setTimeout(function(){
                            $('#result-dialog').modal('hide');
                        },2000);
                        $('.item-'+index).remove();

                        lock.pass = false;
                    }
                }
            });
        }

    });

    //编辑某个书签，并且添加到频道中
    $('.editBookmark').click(function(event){
        var index = $(event.target).data('index');
        var title = $('.link-'+index).text();
        var description = $('.description-'+index).text();
        var bookmarkid = $('.footer-'+index).data('bookmarkid');
        var channelTitle = $('#channel-title').text();
        $('#pass-edit-box-title').val(title);
        $('#pass-edit-box-description').val(description);
        $('#pass-edit-ok').data('bookmarkid',bookmarkid);
        $('#pass-edit-ok').data('index',index);
        $('#pass-edit-box').modal('show');
    });

    //确认通过当前的书签
    $('#pass-edit-ok').click(function(event){
        var bookmarkId = $('#pass-edit-ok').data('bookmarkid');
        var index =   $('#pass-edit-ok').data('index');
        var channelId = $('#control-body').data('channelid');
        var title = $('#pass-edit-box-title').val();
        var description = $('#pass-edit-box-description').val();
        if(!lock.edit){
            lock.edit = true;
            $.ajax({
                url: '/api/bookmarks/edit/'+channelId+'/'+bookmarkId,
                type:'post',
                data:{title:title,description:description},
                statusCode: {
                    401: function() {
                        $('#pass-edit-box').modal('hide');
                        //结果提示
                        $('#result-dialog').modal('show');
                        setTimeout(function(){
                            $('#result-dialog').modal('hide');
                        },2000);

                        lock.edit = false;
                    },
                    200: function(){
                        $('#pass-edit-box').modal('hide');
                        //结果提示
                        $('#result-dialog').modal('show');
                        setTimeout(function(){
                            $('#result-dialog').modal('hide');
                        },2000);
                        $('.item-'+index).remove();

                        lock.edit = false;
                    }
                }
            });
        }

    });

    //筛除某个书签
    $('.deleteBookmark').click(function(event){
        var index = $(event.target).data('index');
        var title = $('.link-'+index).text();
        var bookmarkid = $('.footer-'+index).data('bookmarkid');
        var channelTitle = $('#channel-title').text();
        $('#delete-to-channel').text(channelTitle);
        $('#delete-bookmark-title').text(title);
        $('#delete-confirm-ok').data('bookmarkid',bookmarkid);
        $('#delete-confirm-ok').data('index',index);
        $('#delete-confirm-box').modal('show');
    });

    //确认删除某个书签
    $('#delete-confirm-ok').click(function(event){
        var reason = $('#delete-result-box').val();
        if(!reason) return $('#delete-result-box').addClass('error');
        var bookmarkId = $('#delete-confirm-ok').data('bookmarkid');
        var index =   $('#delete-confirm-ok').data('index');
        var channelId = $('#control-body').data('channelid');
        if(!lock.delete){
            lock.delete = true;
            $.ajax({
                url: '/api/bookmarks/delete/'+channelId+'/'+bookmarkId,
                type:'post',
                data:{reason:reason},
                statusCode: {
                    401: function() {
                        $('#delete-confirm-box').modal('hide');
                        //结果提示
                        $('#result-dialog').modal('show');
                        setTimeout(function(){
                            $('#result-dialog').modal('hide');
                        },2000);

                        lock.delete = false;
                    },
                    200: function(){
                        $('#delete-confirm-box').modal('hide');
                        //结果提示
                        $('#result-dialog').modal('show');
                        setTimeout(function(){
                            $('#result-dialog').modal('hide');
                        },2000);
                        $('.item-'+index).remove();
                        lock.delete = false;
                    }
                }
            });
        }
    });

    //修改频道信息
    $('#channel-info-button').click(function(event){
        var channelId = $('#control-body').data('channelid');
        var channel = {};
        channel.name = $('#channel-info-name>input').val();
        channel.logo = $('#channel-change-logo').attr('src').split(".com/")[1];
        channel.description = $('#channel-info-description>textarea').text();
        channel.type = $("input[name='type']:checked").val();
        channel.tags = $("#channel-info-tags>input").val();

        if(!channel.name){
            return $("#Channel-Change-Error").text('频道名称不能为空。').show();
        }
        if(!channel.logo){
            return $("#Channel-Change-Error").text('频道logo不能为空。').show();
        }
        if(!channel.description){
            return $("#Channel-Change-Error").text('频道描述不能为空。').show();
        }
        if(!channel.type){
            return $("#Channel-Change-Error").text('频道分类不能为空。').show();
        }
        if(!channel.tags){
            return $("#Channel-Change-Error").text('频道标签不能为空。').show();
        }
        if(!lock.update){
            lock.update = true;
            $.ajax({
                url: '/channel/'+channelId+'/update',
                type:'post',
                data:channel,
                statusCode: {
                    401: function() {
                        //结果提示
                        $('#result-dialog').modal('show');
                        setTimeout(function(){
                            $('#result-dialog').modal('hide');
                        },2000);

                        lock.update  = false;
                    },
                    200: function(){
                        //结果提示
                        $('#result-dialog').modal('show');
                        setTimeout(function(){
                            $('#result-dialog').modal('hide');
                        },2000);

                        lock.update = false;
                    }
                }
            });
        }


    });
}
function uploadLogo(){
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
                $('#channel-info-logo').addClass('upLoading');
            },
            'FileUploaded': function(up, file, info) {
                var info  = JSON.parse(info);
                var logo = info.key;
                $('#channel-change-logo').attr('src',cdnUrl + logo);
                $('#channel-info-logo').removeClass('upLoading');
            },
            'Error': function(up, err, errTip) {
                console.log(err);
            }
        }
    });
}