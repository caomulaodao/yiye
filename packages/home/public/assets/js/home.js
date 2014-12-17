/**
 * Created by laodao on 14-10-10.
 * update by vinthony on 2014年12月12日19:57:18 
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

}



