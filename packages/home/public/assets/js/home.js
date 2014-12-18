/**
 * Created by laodao on 14-10-10.
 * update by vinthony on 2014年12月12日19:57:18 
 */
$(function(){
    initialize();
});

//initialization
function initialize() {
    // 如果元素之前绑定过click则取消绑定
    $('#rounded-arrow').unbind('click');
    $('#rounded-arrow').on('click', function() {
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('#function-module').removeClass('unfold');
        } else {
            $(this).addClass('active');
            $('#function-module').addClass('unfold');
        }
    });

    // 绑定切换事件。
    $('#function-module-ul').delegate('li','click',function(e){
        var id = $(e.currentTarget).attr('id');
        if(id == "help"){
            window.location.href = "/our/team/";
        }else{
            window.location.href = "/home#"+id;
        }
    });

    //箭头和消息红点提示ajax
    function redPointAjax() {
        $.ajax({
            url: '/api/home/msgcount',
            type: 'get',
            success: function (response) {
                var count = response.data.count;
                var callmsg = response.data.callmsg;
                var reminding = response.data.reminding;
                var checkmsg = response.data.checkmsg;
                var praisemsg = response.data.praisemsg;
                if(count > 0) {
                    var count = response.data.count;
                    $('.red-point-count').text(count).show();
                }
                else {
                     $('.red-point-count').hide();
                }
            }              
        });
    }
    // // 轮询消息提示Ajax请求
    setInterval(redPointAjax(), 5000);  
}



