(function(){
	(function () { 
		var $link = $('.link');
		$link[0] && setTimeout(()=>$link.addClass('link-active'), 500)
	})()
})(jQuery)