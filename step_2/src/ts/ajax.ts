export class BaseError extends Error {
    message: string;
    stack: string;
    name: string;
    constructor (message: string) {
        super();
        this.message = message;
        // this.stack = (new Error()).stack; // non standard feature
    }
}

class MissingRequireArgsException extends BaseError {
    constructor (message: string) {
        super(message);
        this.name = "MissingRequireArgsException";
    }
}

interface AjaxOptions {
    url: string;
    method: string;
    contentType: string;
    data: Object;
}

/**
 * ajax wrapper for asynchronous calls
 * @param  {Object}   options  - an object of key value pairs 
 * @param  {Function} callback - callback function that recieves response objects
 */
export function ajax (options: AjaxOptions, callback: Function) {
    if (!options || !options.url || !options.method) {
        throw new MissingRequireArgsException("You are missing required arguments. Url and method are the minimum requirements.");
    }

    let xmlhttp: XMLHttpRequest;

    if ((<any>window).XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
            if (xmlhttp.status === 200) {
                callback(JSON.parse(xmlhttp.response), null);
            } else if (xmlhttp.status === 404) {
                callback(null, xmlhttp);
            } else {
                callback(null, xmlhttp);
            }
        }
    };

    xmlhttp.open(options.method, options.url, true);

    xmlhttp.setRequestHeader("Content-Type", options.contentType || "text/json");
    if (options.data && options.contentType) {
        if (options.contentType === "text/json") {
            options.data = JSON.stringify(options.data);
        }
    }
    xmlhttp.send(options.data);
}

/**
 * GET wrapper on ajax
 * @param  {string}   url       - url to get resource
 * @param  {Function} callback  - callback to recieve response object
 */
export function get (url: string, callback: Function) {
    let options: AjaxOptions = {
        url: url,
        method: "GET",
        data: null,
        contentType: null
    };
    ajax(options, callback);
};

/**
 * POST wrapper on ajax
 * @param  {string}   url      url to post to
 * @param  {Object}   data     JSON object to send
 * @param  {string}   type     content-type
 * @param  {Function} callback callback to recieve response object
 */
export function post (url: string, data: Object, type: string, callback: Function) {
    let options: AjaxOptions = {
        url: url,
        method: "POST",
        data: data,
        contentType: type
    };
    ajax(options, callback);
};

