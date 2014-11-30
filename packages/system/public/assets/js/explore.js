/**
 * Created by zweipix on 14/11/10.
 */

$(window).on('load', function() {
    $('.to-sub').on('click', subChannelAjax(event));
});

function subChannelAjax(event) {
    console.log(event.currentTarget);

}