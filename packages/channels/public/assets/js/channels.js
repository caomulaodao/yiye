/**
 * Created by laodao on 14/10/28.
 */
$(window).load(function() {
    initialize();
    commentClick();
    channelsSub();
});

function initialize() {
    $('#links-btn').on('click', function(){
        $('#members-part').hide();
        $('#links-part').show();

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