const TEXT = {
	en: {
		page_title: " Coming soon · Johann Hospice ",
		title: "Coming soon.",
		description_1: "I am Johann Hospice a junior developer based in France.",
		description_2: "This web site is in development, it will serve as a support who permit to expose my courses, skills and experiences.",
		btn_info: "Learn more",
		phone: "Phone"
	},
	fr: {
		page_title: " Site en construction · Johann Hospice ",
		title: "Site en construction.",
		description_1: "Je m'appelle Johann Hospice et je suis développeur junior.",
		description_2:"Ce site est en cours de développement, il servira de support permettant d'exposer mon cursus, mes compétences et mes expériences.",
		btn_info: "En savoir plus",
		phone: "Téléphone"
	}
};

(function($){
	function translateAll(obj){ Object.keys(obj).forEach(function(field){translateField(field, obj)}) };
	function translateField(field, obj){ $(`#${field}`).text(obj[field]) };
	function setLanguage(lang){
		$(`.lang:contains('${lang}')`).addClass('lang-active')
		$(`.lang:not(:contains('${lang}'))`).removeClass('lang-active')
		translateAll(TEXT[lang]) 
	}	
	$('.lang').click(function(obj){
		setLanguage(obj.currentTarget.text.toLowerCase());
	});
	setLanguage('en');
})(jQuery)
