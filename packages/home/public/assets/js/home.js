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
    $('.submit-background').scroll(function(){
        return false;
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

    var redPointAjax = function() {
        $.ajax({
            url: '/api/home/msgcount',
            type: 'get',
            success: function (response) {
                var count = response.data.count;
                var checkmsg = response.data.checkmsg;
                var callmsg = response.data.callmsg;
                var remindmsg = response.data.reminding;                
                var praisemsg = response.data.praisemsg;
                if(count > 0) {
                    var count = response.data.count;
                    $('.red-point-count').text(count).show();
                    if(checkmsg > 0) {
                        $('#check-btn>a').text('审核('+ checkmsg +')');
                    }
                    if(callmsg > 0) {
                        $('#inform-btn>a').text('通知('+ callmsg +')');
                    }
                    if(remindmsg > 0) {
                        $('#attention-btn>a').text('关注('+ remindmsg +')');
                    }
                    if(praisemsg > 0) {
                        $('#praise-btn>a').text('赞('+ praisemsg +')');
                    }
                }
                else {
                     $('.red-point-count').hide();
                }
            }              
        });
    };

    setInterval(redPointAjax(), 300000);
}



