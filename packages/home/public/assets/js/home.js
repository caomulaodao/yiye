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

    function redPointAjax() {
        $.ajax({
            url: '/api/home/msgcount',
            type: 'get',
            success: function (response) {
                if(response.code>0) return;
                var nCount = response.data.count;
                $('.red-point-count').data('number', nCount);
                showPointNum();
            }              
        });
    };

    //控制红点 tab 数字的显示方式
    function showPointNum() {
        var nCount = $('.red-point-count:first').data('number');
        if(nCount > 99) {
            $('.red-point-count').text('99+');   //数字大于0，显示99+
        } else if(nCount <= 0) {
            $('.red-point-count').hide();        //数字等于0，红点消失
        } else {
            $('.red-point-count').text(nCount).show();  //数字大于0且小于100，显示红点数字
        }
    }

    //消息ajax
    redPointAjax();

}



