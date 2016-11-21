(function () {
	$('.collapse').collapse()
    $('#tab-work a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    })
    $('.carousel').carousel()
})(jQuery)