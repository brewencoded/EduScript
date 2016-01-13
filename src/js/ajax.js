var $ = (function($) {
	function MissingRequireArgsException(message) {
		this.name = 'MissingRequireArgsException';
        this.message = message;
        this.stack = (new Error()).stack;
    }
    MissingRequireArgsException.prototype = Object.create(Error.prototype);
	/**
	 * ajax wrapper for asynchronous calls
	 * @param  {Object}   options  - an object of key value pairs 
	 * @param  {Function} callback - callback function that recieves response objects
	 */
    function ajax(options, callback) {
    	if(!options || !options.url || !options.method) {
    		throw new MissingRequireArgsException('You are missing required arguments. Url and method are the minimum requirements.');
    	}

        var xmlhttp;

        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    callback(JSON.parse(xmlhttp.response), null);
                } else if (xmlhttp.status == 404) {
                    callback(null, xmlhttp);
                } else {
                    callback(null, xmlhttp);
                }
            }
        };

        xmlhttp.open(options.method, options.url, true);
        xmlhttp.setRequestHeader("Content-Type", options.contentType | 'text/json');
        if(options.data && options.contentType) {
        	if(options.contentType === 'text/json') {
        		options.data = JSON.stringify(options.data);
        	} 
        }
        xmlhttp.send(options.data);
    }


    $.ajax = ajax;

    /**
     * GET wrapper on ajax
     * @param  {string}   url       - url to get resource
     * @param  {Function} callback  - callback to recieve response object
     */
    $.get = function (url, callback) {
    	var options = {
    		url: url,
    		method: 'GET',
    		data: null
    	};
    	$.ajax(options, callback);
    };

    /**
     * POST wrapper on ajax
     * @param  {string}   url      url to post to
     * @param  {Object}   data     JSON object to send
     * @param  {string}   type     content-type
     * @param  {Function} callback callback to recieve response object
     */
    $.post = function (url, data, type, callback) {
    	var options = {
    		url: url,
    		method: 'POST',
    		contentType: type,
    		data: data
    	};
    	$.ajax(options, callback);
    };

    return $;
}($ || {}));
