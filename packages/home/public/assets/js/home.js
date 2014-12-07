/**
 * Created by laodao on 14-10-10.
 */
$(function(){
    initialize();
});

//initialization
function initialize() {
    //subscription & administration button
    $('.subscription').on('click touch', function(){
        $(this).addClass('active').next().removeClass('active');
        $('.channel-list').show().next().hide();
    });

    $('.administration').on('click touch', function(){
        $(this).addClass('active').prev().removeClass('active');
        $('.admin-interface').show().prev().hide();
    });

    $('.channel-item').on('click touch', function(){
        $('.channel-item').removeClass('active');
        $(this).addClass('active').children('.links-num').remove();
    });
    $('#explore').on('click', function() {
        $(this).addClass('locked');
    });
    $('#user-center, #sub-channel-list>li, #admin-channel-list>li, .create-channel>button').on('click', function() {
        $('#explore').removeClass('locked');
    });
    $('#explore').tooltip();
}



