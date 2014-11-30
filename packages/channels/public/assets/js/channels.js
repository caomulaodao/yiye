/**
 * Created by laodao on 14/10/28.
 */
$(window).load(function() {
    initialize();
    channelsSub();
});

function initialize() {
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
            type:'get'
        }).done(function ( data ) {
            if(data.results.isLiked == false){
                var count = $(that).find('span');
                count.text(+count.text()+1);
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
            if(data.results.isLiked == true && data.results.isHated == false){
                 var count = $(that).parent().find('span');
                 count.text(+count.text()-1);
            }
            bkDown = false;
        });
    });

}

function commentClick() {
    $('.comment').on('click', function(){
        var $comment = $(this).parent().parent().next();
        $comment.hasClass('open')?
            $comment.removeClass('open'):
            $comment.addClass('open');
    });

    $('.reply-key').on('click', function(){
        $(this).parent().next().show();
    });
    $('.reply-button a').on('click', function() {
        $(this).parent().parent().hide();
    });
    $('.bottom-comment .reply-words').on('click', function(){
        $(this).text("");
        $(this).next().show();
    });
    $('.comment-button a').on('click', function(){
        $(this).parent().hide();
    });
}

//订阅频道
function channelsSub(){
    $('#channel-sub').click(function(event){
        var channelId = $('#control-body').data('channelid');
        $.get('/channel/sub/'+channelId, function(data) {
            if(data.success){
                $('#channel-sub').text('已订阅').attr("id","channel-subed");
            }
        });
    });
}
