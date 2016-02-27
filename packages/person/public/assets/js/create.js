/**
 * Created by zweipix on 14/11/30.
 */

$(function(){
    subChannelAjax();
    toolTipFun();
});

function toolTipFun() {
    $('.ex-creator').tooltip();
}

function subChannelAjax() {
    $('.to-sub').on('click', function(event){
        var that = this;
        var channelId = $(that).attr('data-id');
        $.ajax({
            type: "POST",
            url: '/channel/sub/' + channelId
        }).done(function(){
            if(data.code == 0){
                $(that).addClass('have-subed').removeClass('to-sub').html('已订阅');
            }else{
                alert("请先登录");
            }
        });
    });
}