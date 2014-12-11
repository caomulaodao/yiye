/**
 * Created by laodao on 14/10/28.
 */
$(window).load(function() {
    init();
    channelsSub();
});

function init() {
    $('#links-btn').on('click', function(){
        $('#members-part').hide();
        $('#links-part').show();
    });
    var bkUp = false;
    var bkDown = false;
    //按钮点赞
    $("#sub-channel-list").on("click",".up",function(){
        if(bkUp) return false;
        var that = this;
        bkUp = true;
        var bookmarkId = $(that).data('bookmarkid');
        $.ajax({
            url: '/api/bookmarks/like/'+bookmarkId,
            type:'POST'
        }).done(function ( data ) {
            if(data.code == 0){
                if(data.data.results.isLiked == false){
                    var count = $(that).find('span');
                    count.text(+count.text()+1);
                }
            }else{

            }
            bkUp = false;
        });
    });
    //按钮反对
    $("#sub-channel-list").on("click",".down",function(){
        if(bkDown) return false;
        var that = this;
        bkDown = true;
        var bookmarkId = $(that).data('bookmarkid');
        $.ajax({
            url: '/api/bookmarks/hate/'+bookmarkId,
            type:'get'
        }).done(function ( data ) {
            if(data.code == 0){
                if(data.results.isLiked == true && data.results.isHated == false){
                    var count = $(that).parent().find('span');
                    count.text(+count.text()-1);
                }
            }else{

            }
            bkDown = false;
        });
    });

}


//订阅频道
function channelsSub(){

    $('#subscribe-btn').click(function(event){
        var channelId = $('#control-body').data('channelid');
        $.get('/channel/sub/'+channelId, function(data) {
            if(data.success){
                $('#channel-sub').text('取消订阅').attr("id","channel-subed");
            }
        });
    });
}
