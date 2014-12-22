/**
 * Created by laodao on 14/12/21.
 */

$(function(){
    $("#user-search").click(function(){
        var userInfo = $("#user-info").val();
        var userType = $("#user-type option:selected").val();
        location.href = "/overlook/user?type="+userType+"&q="+userInfo;
    });
});
