/**
 * Created by laodao on 14/12/21.
 */

$(function(){
    var setLock = false;
    var canLock = false;
    $("#user-search").click(function(){
        var userInfo = $("#user-info").val();
        var userType = $("#user-type option:selected").val();
        location.href = "/overlook/user?type="+userType+"&q="+userInfo;
    });

    //添加后台权限
    $(".setAdmin").click(function(){
        if(setLock) return false;
        var userId = $(this).data("userid");
        if(confirm("确定添加此用户后台权限？")){
            setLock = true;
            $.ajax({
                url: '/api/overlook/setAdmin',
                data: {'userId': userId},
                type:'POST'
            }).done(function ( data ) {
                if(data.code == 0){
                    alert(data.msg);
                    location.reload();
                }else{
                    alert(data.msg);
                }
                setLock = false;
            });
        }

    });

    //取消后台权限
    //添加后台权限
    $(".cancelAdmin").click(function(){
        if(canLock) return false;
        var userId = $(this).data("userid");
        if(confirm("确定取消此用户后台权限？")){
            canLock = true;
            $.ajax({
                url: '/api/overlook/cancelAdmin',
                data: {'userId': userId},
                type:'POST'
            }).done(function ( data ) {
                if(data.code == 0){
                    alert(data.msg);
                    location.reload();
                }else{
                    alert(data.msg);
                }
                canLock = false;
            });
        }

    });
});
