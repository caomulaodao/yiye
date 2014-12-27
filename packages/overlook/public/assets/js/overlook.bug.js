/**
 * Created by coolbit.in@gmail.com on 14/12/27.
 */
$(function(){
    //bug删除锁
    var DeLock = false;

    //bug搜索
    $("#bug-search").click(function(){
        var userInfo = $("#bug-info").val();
        var userType = $("#bug-type option:selected").val();
        location.href = "/overlook/bug?type="+userType+"&q="+userInfo;
    });
    //bug删除
    $(".bugDelete").click(function(){
        if(DeLock) return false;
        var bugId = $(this).data("bugid");
        if(confirm("确定删除此Bug记录？")){
            DeLock = true;
            $.ajax({
                url: '/api/overlook/bugDelete',
                data: {'bugId': bugId},
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
