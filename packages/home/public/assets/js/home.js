/**
 * Created by laodao on 14-10-10.
 */
$(window).load(function(){
    initialize();
    commentClick();

});

//initialization
function initialize() {

    //personal-center
    $('.personal-center-tab>ul>li:first-child').on('click touch', function(){
        $('.personal-center-tab>ul>li').removeClass('active');
        $(this).addClass('active');
        $('.tab-content>div').hide();
        $('.tab-content>div:first-child').show();
    });
    $('.personal-center-tab>ul>li:nth-child(2)').on('click touch', function(){
        $('.personal-center-tab>ul>li').removeClass('active');
        $(this).addClass('active');
        $('.tab-content>div').hide();
        $('.tab-content>div:nth-child(2)').show();
    });
    $('.personal-center-tab>ul>li:last-child').on('click touch', function(){
        $('.personal-center-tab>ul>li').removeClass('active');
        $(this).addClass('active');
        $('.tab-content>div').hide();
        $('.tab-content>div:last-child').show();
    });

    $('.edit-button').on('click', function(){
        $(this).hide();
        $(this).prev().hide();
        $('.reset-name').show();
        $('.reset-name-confirm').show();
    });
    //Apple-switch click effect
    $('.toggle>.check').on('click touch', function() {
        $(this).attr('class') === 'check'?
            $(this).addClass('checked'):
            $(this).removeClass('checked');
    })

    //setting-channel
    $('.channel-inf-tab div:first-child').on('click touch', function(){
        $('.channel-inf-tab div').removeClass('active');
        $(this).addClass('active');
        $('.channel-tab-content>div').hide();
        $('.channel-tab-content>div:first-child').show();
    });
    $('.channel-inf-tab div:last-child').on('click touch', function(){
        $('.channel-inf-tab div').removeClass('active');
        $(this).addClass('active');
        $('.channel-tab-content>div').hide();
        $('.channel-tab-content>div:last-child').show();
    });
    //subscription & administration button
    $('.subscription').on('click touch', function(){
        $('.chose-button button').removeClass('active');
        $(this).addClass('active');
        $('.admin-interface').hide();
        $('.channel-list').show();
        $('.header-setting').hide();
    });
    $('.administration').on('click touch', function(){
        $('.chose-button button').removeClass('active');
        $(this).addClass('active');
        $('.admin-interface').show();
        $('.channel-list').hide();
        $('.header-setting').show();
    });
    //channle-setting-window
    $('.glyphicon-cog').on('click touch', function(){
        $('.shadow').show();
        $('.setting-channel').show();
    });
    $(".content-page").scroll(function(){
        console.log(1);
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


function scrollAjax() {
    var bScroll = false;
    $('#channel-explore').on('scroll', function() {
        var nClientH = $(window).height();
        var nScrollTop = $('#channel-explore').scrollTop();
        var nChannelH = $('#channel-explore ul').height();
        if(nClientH + nScrollTop - 80 >= nChannelH) {

        }
    });
}




