$(function () {

    $(window).scroll(function () {
        if ($('.navigation').css('display') != "none") {
            if (parseInt($('.head').css('height')) - parseInt($('.navigation').css('height')) - parseInt($('.navigation').css("padding")) * 2 <= $(window).scrollTop()) {
                $('.navigation').css({
                    position: 'fixed',
                    marginTop: '0px',
                    top: '0px',
                    backgroundColor: 'rgba(0,0,0,1)'
                })
            }//大于跟着走
            else {
                $('.navigation').css({
                    position: 'relative',
                    marginTop: '-50px',
                    top: '0px',
                    backgroundColor: 'rgba(255,255,255,0)',
                    color: '#fff'
                })
            }
        }
        else {
            if (parseInt($('.head').css('height')) - parseInt($('.navigation-2').css('height')) - parseInt($('.navigation-2').css("padding")) * 2 <= $(window).scrollTop()) {
                $('.navigation-2').css({
                    position: 'fixed',
                    marginTop: '0px',
                    top: '0px',
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    color: '#000'
                })
            }//大于跟着走
            else {
                $('.navigation-2').css({
                    position: 'relative',
                    marginTop: '-41px',
                    top: '0px',
                    backgroundColor: 'rgba(255,255,255,0)',
                    color: '#fff'
                })
            }
        }
    });//导航栏跟随


    var xd_text = $(".xd-text");
    var leader = $('.leader');
    xd_text.click(function () {
        if ($(this).children('i').hasClass('icon-angle-down')) {
            $(this).parent('li').children('.leader').stop().animate({height: '46px'}, 500);
            $(this).children('i').removeClass('icon-angle-down').addClass('icon-angle-up');
        }
        else {
            $(this).parent('li').children('.leader').stop().animate({height: '0px'}, 500);
            $(this).children('i').removeClass('icon-angle-up').addClass('icon-angle-down');


        }
    });//下拉
    var $happy=null;
    $('.guest').click(function(){
        $('.lsl').fadeIn(500);
        $(this).find('.details').fadeIn(500);
        $happy=$(this);
    });
    $('.lsl').click(function(){
         $('.lsl').fadeOut(500);
        $happy.find('.details').fadeOut(500);
    })
    
});