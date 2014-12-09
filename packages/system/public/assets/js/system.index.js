/**
 * Created by laodao on 14/12/1.
 */
$(function(){
    $("#watch-video").click(function(){
        $(".video-modal").show();

    });
    $(".video-modal-close").click(function(){
        $(".video-modal").hide();
    });
});

function ExtInstall() {
    if (chrome.app.isInstalled)
        alert("already installed!");
    else
        chrome.webstore.install();
}