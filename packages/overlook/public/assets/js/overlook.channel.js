/**
 * Created by laodao on 14/12/24.
 */
$(function(){
    $("#channel-search").click(function(){
        var userInfo = $("#channel-info").val();
        var userType = $("#channel-type option:selected").val();
        location.href = "/overlook/channel?type="+userType+"&q="+userInfo;
    });
});
