var $ = (function ($) {

	function Element () {

	}

	function isHTML (str) {
		var htmlTagRe = new RegExp("/<\/?[\w\s=\"/.\':;#-\/]+>/gi");
		return htmlTags.test(str);

	}

	function selectOrCreate (selector) {
		
		return new Element();
	}

	$.get = selectOrCreate;

	/* start-test */
	$.test = {
		Mimic: 'some test code',
		isHTML: isHTML
	};
	/* end-test */

	return $;
}($ || {}));