/**
 * Created by zweipix on 14/11/10.
 */

$(window).on('load', function() {
    mainWidth();
    
});

function mainWidth() {
    var $oParent = $('#water-fall-main');
    var $oBoxW = $('.water-fall-box').width()+20;

    //计算瀑布流显示的列数
    var cols = Math.floor($(window).width() / $oBoxW);
    var rows = Math.ceil($('.water-fall-box').length / cols);

    //设置main的宽度
    var mainWidth = 350 * cols +'px';
    $oParent.css('width', mainWidth);
    console.log(mainWidth);

    //设置main的高度
    var mainHeight = 381 * rows + 'px';
    $oParent.css('height', mainHeight);
    console.log(mainHeight);
}