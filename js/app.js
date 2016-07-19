(function(){
	(function(){
		var $nav = $('nav');
		setInterval(()=> $nav.toggleClass('nav-collapse'), 5000);
	});
	// (function(){ $('.item').css('height', ''+window.outerHeight) })()
	(function () { setTimeout(()=>$('.link').addClass('link-active'), 1000)})()
})(jQuery)