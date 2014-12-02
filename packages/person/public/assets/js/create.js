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
            type: "get",
            url: '/channel/sub/' + channelId
        }).done(function(){
            $(that).addClass('have-subed').removeClass('to-sub').html('已订阅');
        });
    });
}