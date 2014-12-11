/**
 * Created by laodao on 14-10-10.
 */
$(function(){
    initialize();
});

//initialization
function initialize() {
    //控制箭头下拉
    // 如果元素之前绑定过click则取消绑定
    $('#rounded-arrow').unbind('click');
    $('#rounded-arrow').on('click', function() {
        console.log(this);
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('#function-module').removeClass('unfold');
        } else {
            $(this).addClass('active');
            $('#function-module').addClass('unfold');
        }
    });

}



