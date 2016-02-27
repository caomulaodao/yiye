/**
 * Created by zweipix on 14/11/10.
 */
$(function(){
    subChannelAjax();
    goCenter();
    toolTipFun();
    $(window).on('resize', function(){
        goCenter();
    });
});

function subChannelAjax() {
    $('.to-sub').on('click', function(event){
        var that = this;
        var channelId = $(event.currentTarget).data('id');
            $.ajax({
                type: "POST",
                url: '/channel/sub/' + channelId
            }).done(function(data){
                if(data.code == 0){
                    $(that).addClass('have-subed').removeClass('to-sub').html('已订阅');
                }else{
                    alert("请先登录");
                }
            });
    });
}

function toolTipFun() {
    $('.ex-creator').tooltip();
}

function goCenter() {
    var nClientW = $(window).width();
    var nChannelW = $('.channel-showcase').width()+30;
    var cols = Math.floor(nClientW / nChannelW);  //求出频道列数
    var nContentW = cols * 363;             //求出water-fall-main的宽度

    $('#water-fall-main').width(nContentW);
}