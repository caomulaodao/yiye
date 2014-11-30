/**
 * Created by laodao on 14-10-10.
 */
$(window).load(function(){
    initialize();
});

//initialization
function initialize() {
    //subscription & administration button
    $('.subscription').on('click', function(){
        $(this).addClass('active').next().removeClass('active');
        $('.channel-list').show().next().hide();
    });

    $('.administration').on('click', function(){
        $(this).addClass('active').prev().removeClass('active');
        $('.admin-interface').show().prev().hide();
    });
}



