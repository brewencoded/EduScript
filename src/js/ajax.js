var $ = (function($) {

    function ajax(options, callback) {
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
                    callback(xmlhttp);
                } else if (xmlhttp.status == 404) {
                    callback(null, xmlhttp);
                } else {
                    callback(null, xmlhttp);
                }
            }
        };

        xmlhttp.open(options.method, options.url, true);
        xmlhttp.send(options.data);
    }



    $.ajax = ajax;

    $.get = function (url, callback) {
    	var options = {
    		url: url,
    		method: 'GET',
    		data: null
    	};
    	$.ajax(options, callback);
    };

    $.post = function (url, data, callback) {
    	var options = {
    		url: url,
    		method: 'POST',
    		data: data
    	};
    	$.ajax(options, callback);
    };

    return $;
}($ || {}));
