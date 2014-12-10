(function(){
	if(window.location.hash){
		//
		changeSiblings(window.location.hash);
		scrollToPage(getPosition(window.location.hash));
	}else{
		changeSiblings("#staff");
	}
	$('.about-item').delegate('a','click',function(e){
		changeSiblings($(e.currentTarget).attr('href'));
		scrollToPage(getPosition($(e.currentTarget).attr('href')));
	});
	window.onscroll = function (){
		return false;
	}
	function changeSiblings(hash){
		$('.about-item a').removeClass('active');
		$('a[href='+hash+']').addClass('active');
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