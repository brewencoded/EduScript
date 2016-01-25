/// <reference path="../../node_modules/typescript/lib/lib.es6.d.ts" />

import { ajax, get, post, BaseError } from "./ajax";

////////////////////////////////////////////////////////////////////////////////////////////
/// Errors
////////////////////////////////////////////////////////////////////////////////////////////

 /**
 * Error to be thrown when no matching event is found on Element
 */
class NoSuchEventException extends BaseError {
    constructor (public message: string) {
        super(message);
        this.name = "NoSuchEventException";
    }
}

class NotUseableHtmlObjectException extends BaseError {
    constructor (public message: string) {
       super(message);
       this.name = "NotUseableHtmlObjectException";
    }
}

////////////////////////////////////////////////////////////////////////////////////////////
/// Private Utility Functions
////////////////////////////////////////////////////////////////////////////////////////////

/**
 * checks a string for the html format
 * @param  {string}  str - string to test
 * @return {Boolean}       returns whether string is html
 */
function isHTML(str: any) {
    let htmlRegex = /<[a-z][\s\S]*>/;

    return htmlRegex.test(str);
}

/**
 * Extracts tag from html string
 * @param  {string} str - html string
 * @return {string}       tag name
 */
function getTag(str: string) {
    let strippedTags = str.split("<")[1].split(">");
    let strippedAttrs = strippedTags[0].split(" ")[0];

    return strippedAttrs;
}

/**
 * Extracts attributes from html string
 * @param  {string} str - html string
 * @return {Object}       map containing key value pairs of attributes
 */
function getAttrs(str: string) {
    let strippedTags = str.split("<")[1].split(">");
    let attrs = strippedTags[0].split(" ");
    let attrObj: Map<string, string> = new Map<string, string>();

    attrs.shift();
    attrs.forEach((element) => {
        let attr = element.split("=");
        if (attr.length === 1) {
            attrObj.set(attr[0], "");
        } else {
            let key = attr[0];
            let value = attr[1].split('"').join(""); // remove quotes
            attrObj.set(key, value);
        }
    });

    return attrObj;
}

/**
 * Strips text content from tag
 * @param  {string} str - html string
 * @return {string}     text from inside of tag
 */
function getText(str: string) {
    let first = str.indexOf(">");
    first++;
    let last = str.indexOf("<", 1);
    let text = str.slice(first, last);

    return text;
}

 /**
 * Searches DOM using CSS selectors
 * @param  {string} selector     - selector to use in search
 * @return {Object|Object[]} Element or Element[] representing element(s) found or false if no match
 */
function findElement (selector: string): Object|Object[]|boolean {
    let results = document.querySelectorAll(selector);
    let multipleResults: Array<string>;
    if (results.length === 0) {
        return false;
    } else if (results.length > 1) {
        // borrow a method from the Array prototype
        multipleResults = Array.prototype.map.call(results, (element: Element) => {
            return createExistingElement(element);
        });

        return multipleResults;
    } else {
        return createExistingElement(results[0]);
    }
}

/**
 * Uses node to create Element
 * @param  {Object} node 	  - Node to use in object creation
 * @return {Element|Input}      Input for input or select elements, Element for all others
 */
function createExistingElement(node: Element) {
    let tag = node.tagName;
    let attrs = new Map<string, string>();
    let content: string|Node = node.childNodes[0];
    let existingElement: JElement;

    // borrow another method from Array prototype
     Array.prototype.forEach.call(node.attributes, (attr: Attr) => {
         attrs.set(attr.name, attr.value);
     });

    if (tag === "input" || tag === "select") {
        existingElement = new Input(attrs, node);
    } else {
        if (content !== "" && content !== undefined) {
            if (typeof content === "object") {
                existingElement = new JElement(tag, attrs, node, null);
            }
            if (typeof content === "string") {
                existingElement = new JElement(tag, attrs, node, content);
            }
        } else {
            existingElement = new JElement(tag, attrs, node, null);
        }

    }
    return existingElement;
}

////////////////////////////////////////////////////////////////////////////////////////////
/// Objects
////////////////////////////////////////////////////////////////////////////////////////////

interface Listener {
    event: string;
    handler: Function;
}

/**
 * Parent class for general elements
 * @param {string} tag   - tag name
 * @param {Object} attrs - map of attributes and values
 * @param {Object} node  - node to initialize object with
 */
class JElement {
    public tag: string;
    public listeners: Set<Listener>;
    public attrs: Map<string, string>;
    public node: Node;
    public content: string|Node;
    public prototype: Object = JElement.prototype;
    public eventTypes: string[] = ["click", "blur", "hover", "keyup", "focus", "keydown", "mouseup", "mousedown", "mouseleave", "scroll"];

    constructor (tag: string, attrs: Map<string, string>, node: Node, content: string) {
        this.tag = tag;
        this.attrs = attrs;
        this.node = node || this.createNode();
        this.listeners = new Set<Listener>();
        if (content) {
            this.node.appendChild(document.createTextNode(content));
        }
    }

    on (event: string, handler: EventListener) {
        this.node.addEventListener(event, handler);
        this.listeners.add({
            event: event,
            handler: handler
        });

        return this; // method chaining
    }

    off (event: string, fn: EventListener) {
        let handlers: Array<any> = [];
        let i: number = this.listeners.size,
            ii: any;

        this.listeners.forEach((listener: Listener) => {
            if (listener.event === event) {
                handlers.push(listener.handler);
                this.listeners.delete(listener);
            }
        });

        if (fn) {
            this.node.removeEventListener(event, fn);
        } else {
            if (handlers.length === 0) {
                throw new NoSuchEventException("Event is not present in element");
            } else if (handlers.length === 1) {
                this.node.removeEventListener(event, handlers[0]);
            } else {
                for (ii in handlers) {
                    this.node.removeEventListener(event, handlers[ii]);
                }
            }
        }

        return this; // method chaining
    }

    /**
     * Gets or sets attribute of element
     * @param  {string} attr  - attribute to set or get
     * @param  {string} value - value to change attribute to
     * @return {Object}         returns Node object
     */
    attr (attr: string, value: string): JElement|string {
        if (value) {
            this.attrs.set(attr, value);

            return this; // method chaining
        } else {

            return this.attrs.get(attr);
        }
    }

    /**
     * Gets the node representation of the object
     * @return {Object} Node
     */
    getNode (): Node {

        return this.node;
    }

    /**
     * Creates Node object 
     * @return {Object} Node object
     */
    private createNode () {
        let node = document.createElement(this.tag);
        this.attrs.forEach((value, key) => {
            node.setAttribute(key, this.attrs.get(key));
        });

        return node;
    }

    /**
     * Removes the node from the DOM
     * @return {Object} reference to the removedd object as a JElement
     */
    remove () {
        this.node.parentNode.removeChild(this.node);

        return this;
    }

    /**
     * Appends argument to the Element this method is invoked on
     * @param  {string|Object} elementOrString - Either a string, Element, or Node
     * @return {Object}                 		 returns Element
     */
    append (elementOrString: JElement|string|Element) {
        if (typeof elementOrString === "string") {
            if (isHTML(elementOrString)) {
                let elem = (<any>window).$(elementOrString);
                this.node.appendChild(elem.getNode());
            } else {
                this.node.appendChild(document.createTextNode(elementOrString));
            }

        } else {
            if (elementOrString instanceof JElement) {
                this.node.appendChild(elementOrString.getNode());
            } else if (elementOrString instanceof Node) {
                this.node.appendChild(elementOrString);
            } else {
                throw new NotUseableHtmlObjectException("The value is not a valid html string, Node, or Element");
            }
        }

        return this; // method chaining woot!
    }
}

/**
 * Constructor for Input type. Inherits from JElement
 * @param {Object} attrs - attributes to pass to parent
 */
class Input extends JElement {
    public eventTypes: Array<string> = this.eventTypes.concat(["input", "change"]);
    public value: string;

    constructor (attrs: Map<string, string>, node: Node) {
        super("input", attrs, node, null);
        this.value = attrs.get("value") || "";
        // JavaScript provides the event arg so it's fine to leave it as type any
        this.node.addEventListener("keyup", (event: any) => {
            this.value = event.target.value;
        });
    }
}

////////////////////////////////////////////////////////////////////////////////////////////
/// Inititializer
////////////////////////////////////////////////////////////////////////////////////////////

/**
 * JElement creation or searching (does not yet support nested elements)
 * @param  {string} str          - html string or selector
 * @return {Object|Object[]|false} one or more objects or false for search and Element if creating
 */
// JElement Factory
 let jQuery: any = function (str: any): any {
    // call the familiar jquery selector and creation method
    let attrs: Map<string, string>;
    let tag: string;
    let content: string;
    if (typeof str === "string" && isHTML(str)) {
        if (getTag(str) === "input") {
            attrs = getAttrs(str);

            return new Input(attrs, null);
        } else {
            tag = getTag(str);
            attrs = getAttrs(str);
            content = getText(str);

            return new JElement(tag, attrs, null, content);
        }
    } else if (typeof str === "string" && isHTML(str) === false) {
        return findElement(str);
    } else {
        return {};
    }
};

 ////////////////////////////////////////////////////////////////////////////////////////////
/// Public Utility Functions
////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Variadic function. Takes multiple objects and combines them into a single  object. shallow merge.
 * @return {Object} merged objects
 */
jQuery.extend = function() {

    // Variables
    let extended: any = <any>{}; // must be of type any
    let length = arguments.length; // arguments has pretty bad performance, don't overuse it
    // Merge the object into the extended object
    let merge = function(obj: any) {
        for (let prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                extended[prop] = obj[prop];
            }
        }
    };

    // Loop through each object and conduct a merge
    for (let i = 0; i < length; i++) {
        let obj = arguments[i];
        merge(obj);
    }

    return extended;
};
/* start-ajax */
jQuery.ajax = ajax;
jQuery.get = get;
jQuery.post = post;
/* end-ajax */

// expose prototype
jQuery.fn = JElement.prototype;

////////////////////////////////////////////////////////////////////////////////////////////
/// Test Code : stripped out during build
////////////////////////////////////////////////////////////////////////////////////////////

/* start-test */
jQuery.test = {
    isHTML: isHTML,
    getTag: getTag,
    getAttrs: getAttrs,
    getText: getText,
    JElement: JElement,
    Input: Input,
    NoSuchEventException: NoSuchEventException
};
/* end-test */

// set window objects
(<any>window).jQuery = jQuery;
(<any>window).$ = jQuery;

