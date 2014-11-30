/**
 * Created by zweipix on 14/11/10.
 */

$(window).on('load', function() {
    subChannelAjax();
    goCenter();
    $(window).on('resize', function(){
        goCenter();
    });
});

function subChannelAjax() {
    $('.to-sub').on('click', function(event){
        var that = this;
        var channelId = $(event.currentTarget).data('id');
            $.ajax({
                type: "get",
                url: '/channel/sub/' + channelId
            }).done(function(){
                $(that).addClass('have-subed').removeClass('to-sub').html('已订阅');
            });
    });
}

function goCenter() {
    var nClientW = $(window).width();
    var nChannelW = $('.channel-showcase').width()+30;console.log(nChannelW);

    var cols = Math.floor(nClientW / nChannelW);  //求出频道列数
    var nContentW = cols * 365;             //求出water-fall-main的宽度
    console.log(cols);

    $('#water-fall-main').width(nContentW);
}