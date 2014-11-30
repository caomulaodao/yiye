/**
 * Created by zweipix on 14/11/30.
 */

$(window).on('load', function(){
    subChannelAjax();
});


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