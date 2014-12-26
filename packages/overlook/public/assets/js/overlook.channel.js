/**
 * Created by laodao on 14/12/24.
 */
$(function(){
    //频道删除锁
    var DeLock = false;

    //频道搜索
    $("#channel-search").click(function(){
        var userInfo = $("#channel-info").val();
        var userType = $("#channel-type option:selected").val();
        location.href = "/overlook/channel?type="+userType+"&q="+userInfo;
    });
    //频道删除
    $(".channelDelece").click(function(){
        if(DeLock) return false;
        var channelId = $(this).data("channelid");
        if(confirm("确定删除此频道？")){
            DeLock = true;
            $.ajax({
                url: '/api/overlook/channelDelece',
                data: {'channelId': channelId},
                type:'POST'
            }).done(function ( data ) {
                if(data.code == 0){
                    alert(data.msg);
                    location.reload();
                }else{
                    alert(data.msg);
                }
                DeLock = false;
            });
        }

    });
});
