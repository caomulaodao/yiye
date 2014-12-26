/**
 * Created by laodao on 14/10/28.
 */
$(function() {
    init();
});

function init() {
    $('#links-btn').on('click', function(){
        $('#members-part').hide();
        $('#links-part').show();
    });
    var bkUp = false;
    var bkDown = false;
    // var subDown = false;

    //按钮点赞
    $("#sub-channel-list").on("click",".up",function(){
        if(bkUp) return false;
        var that = this;
        bkUp = true;
        var bookmarkId = $(that).data('bookmarkid');
        $.ajax({
            url: '/api/bookmarks/like',
            data: {'bookmarkId': bookmarkId},
            type:'POST'
        }).done(function ( data ) {
            if(data.code == 0){
                if(data.data.isLiked == false){
                    var count = $(that).find('span');
                    count.text(+count.text()+1);
                }
            }else{

            }
            bkUp = false;
        });
    });

    //按钮反对
    $("#sub-channel-list").on("click",".down",function(){
        if(bkDown) return false;
        var that = this;
        bkDown = true;
        var bookmarkId = $(that).data('bookmarkid');
        $.ajax({
            url: '/api/bookmarks/hate',
            data: {'bookmarkId': bookmarkId},
            type:'POST'
        }).done(function ( data ) {
            if(data.code == 0){
                if(data.data.isLiked == true && data.data.isHated == false){
                    var count = $(that).parent().find('span');
                    count.text(+count.text()-1);
                }
            }else{

            }
            bkDown = false;
        });
    });

    //订阅频道

    $('#subscribe-btn').click(function(event){
        // if(subDown) return false;
        var channelId = $('#control-body').data('channelid');
        // subDown = true;
        $.ajax({
            url: '/channel/sub/',
            type:'POST',
            data:{'channelId':channelId}
        }).done(function(data){
            window.location.href = window.location.href;
            // subDown = false;
        });
    });

    //取消订阅频道

    $('#nosubscribe-btn').click(function(event){
        // if(subDown) return false;
        var channelId = $('#control-body').data('channelid');
        // subDown = true;
        $.ajax({
            url: '/channel/noSub/',
            type:'POST',
            data:{'channelId':channelId}
        }).done(function(data){
            window.location.href = window.location.href;
            // subDown = false;
        });
    });
    $('#creator-btn').click(function(event){
        var channelId = $('#control-body').data('channelid');     
        var destination = 'http://'+location.host+'/channel/'+channelId+'/manage';
        location.href = destination;
    })

//取消订阅频道
    // $('#subscribe-btn').click(function(event){
    //     if(subDown) return false;
    //     var channelId = $('#control-body').data('channelid');
    //     subDown = true;
    //     $.ajax({
    //         url: '/channel/sub/',
    //         type:'POST',
    //         data:{'channelId':channelId}
    //     }).done(function(data){
    //         if(data.code == 0){

    //             $('#channel-sub').text('已订阅').attr("id","channel-subed");

    //         }else{

    //         }
    //         subDown = false;
    //     });
    // });

}
