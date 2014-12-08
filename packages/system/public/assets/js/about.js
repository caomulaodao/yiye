(function(){
	if(window.location.hash){
		scrollToPage(getPosition(window.location.hash));
	}
	$('.about-item').delegate('a','click',function(e){
		scrollToPage(getPosition($(e.currentTarget).attr('href')));
	});
	window.onscroll = function (){
		return false;
	}
	function scrollToPage(pos){
		$('#content-manage').animate({"top":pos},300,'swing',function(){});
	}
	function getPosition(hash){
		switch(hash){
			case '#staff':
				return 0;
			case '#joinUs':
				return '-100vh';
			case '#bugReporter':
				return '-200vh';
			case '#followUs':
				return '-300vh';
			default:
				return 0;	
		}
	}
})();