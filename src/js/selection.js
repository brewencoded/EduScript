//TODO: implement off, append, remove, click, extend 

var $ = (function($) {
    ////////////////////////////////////////////////////////////////////////////////////////////
    /// Utility Functions
    ////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * checks a string for the html format
     * @param  {string}  str - string to test
     * @return {Boolean}       returns whether string is html
     */
    function isHTML(str) {
        var htmlRegex = /<[a-z][\s\S]*>/;

        return htmlRegex.test(str);
    }

    /**
     * Extracts tag from html string
     * @param  {string} str - html string
     * @return {string}       tag name
     */
    function getTag(str) {
        var strippedTags = str.split('<')[1].split('>');
        var strippedAttrs = strippedTags[0].split(' ')[0];

        return strippedAttrs;
    }

    /**
     * Extracts attributes from html string
     * @param  {string} str - html string
     * @return {Object}       map containing key value pairs of attributes
     */
    function getAttrs(str) {
        var strippedTags = str.split('<')[1].split('>');
        var attrs = strippedTags[0].split(' ');
        var i;
        var attrObj = {};

        attrs.shift();
        attrs.forEach(function(element) {
            var attr = element.split("=");
            if (attr.length === 1) {
                attrObj[attr[0]] = '';
            } else {
                var key = attr[0];
                var value = attr[1].split('"').join(''); //remove quotes
                attrObj[key] = value;
            }
        });

        return attrObj;
    }
    /**
     * Searches DOM using CSS selectors
     * @param  {string} selector     - selector to use in search
     * @return {Object|Object[]|false} Element or Element[] representing element(s) found or false if no match
     */
    function findElement(selector) {
        var results = document.querySelectorAll(selector);
        var multipleResults = [];
        if (results.length === 0) {
            return false;
        } else if (results.length > 1) {
            for (var i = 0; i < results.length; i++) {
                multipleResults.push(createExistingElement(results[i]));
            }

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
    function createExistingElement(node) {
        var tag = node.tagName;
        var attrs = {};
        var existingElement;
        for (var attr in node.attributes) {
            if (node.attributes.hasOwnProperty(attr)) {
                attrs[node.attributes[attr].name] = node.attributes[attr].value;
            }
        }
        if (tag === 'input' || tag === 'select') {
            existingElement = new Input(attrs);
        } else {
            existingElement = new Element(tag, attrs, node);
        }

        return existingElement;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////
    /// Objects
    ////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Parent class for general elements
     * @param {string} tag   - tag name
     * @param {Object} attrs - map of attributes and values
     * @param {Object} node  - node to initialize object with
     */
    function Element(tag, attrs, node) {
        this.tag = tag;
        this.attrs = attrs;
        this.listeners = [];
        if (node) {
            this.node = node;
        } else {
            this.node = this.createNode();
        }
    }
    Element.prototype.eventTypes = ['click', 'blur', 'hover', 'keyup', 'focus', 'keydown', 'mouseup', 'mousedown', 'mouseleave', 'scroll'];
    /**
     * add event handler to element
     * @param  {string} event     - event name
     * @param  {Function} handler - function to use on event
     * @return {Object}             returns element object
     */
    Element.prototype.on = function(event, handler) {
        this.node.addEventListener(event, handler);
        this.listeners.push({
            event: event,
            handler: handler
        });

        return this; //method chaining
    };
    /**
     * remove event handler from element
     * @param  {string} event - event name
     * @return {Object}         returns element object
     */
    Element.prototype.off = function(event) {

        return this; //method chaining
    };
    /**
     * Gets or sets attribute of element
     * @param  {string} attr  - attribute to set or get
     * @param  {string} value - value to change attribute to
     * @return {Object}         returns Node object
     */
    Element.prototype.attr = function(attr, value) {
        if (value) {
            this.attrs[attr] = value;

            return this; //method chaining
        } else {

            return this.attrs[attr];
        }
    };
    /**
     * Creates Node object 
     * @return {Object} Node object
     */
    Element.prototype.createNode = function() {
        var node = document.createElement(this.tag);
        for (var key in this.attrs) {
            if (this.attrs.hasOwnProperty(key)) {
                node.setAttribute(key, this.attrs[key]);
            }
        }

        return node;
    };
    /**
     * Gets the node representation of the object
     * @return {Object} Node
     */
    Element.prototype.getNode = function() {

        return this.node;
    };
    /**
     * Constructor for Input type. Inherits from Element
     * @param {Object} attrs - attributes to pass to parent
     */
    function Input(attrs) {
        Element.call(this, 'input', attrs);
        this.value = '';
        Input.prototype.eventTypes = this.eventTypes.concat(['input', 'change']);

        this.node.addEventListener('keyup', function (e) {
        	this.value = e.target.value;
        }.bind(this));

    }


    Input.prototype = Object.create(Element.prototype);

    ////////////////////////////////////////////////////////////////////////////////////////////
    /// Inititializers
    ////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Element creation or searching (does not yet support nested elements)
     * @param  {string} str          - html string or selector
     * @return {Object|Object[]|false} one or more objects or false for search and Element if creating
     */
    $.elem = function(str) {
        var attrs;
        var tag;
        if (isHTML(str)) {
            if (getTag(str) === 'input') {
                attrs = getAttrs(str);

                return new Input(attrs);
            } else {
                tag = getTag(str);
                attrs = getAttrs(str);

                return new Element(tag, attrs);
            }
        } else {

            return findElement(str);
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////
    /// Test Code : stripped out during build
    ////////////////////////////////////////////////////////////////////////////////////////////

    /* start-test */
    $.test = {
        Mimic: 'some test code',
        isHTML: isHTML,
        getTag: getTag,
        getAttrs: getAttrs,
        Element: Element,
        Input: Input
    };
    //bind polyfill - PhantomJS does not include bind()
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== 'function') {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function() {},
                fBound = function() {
                    return fToBind.apply(this instanceof fNOP ? this : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            if (this.prototype) {
                // native functions don't have a prototype
                fNOP.prototype = this.prototype;
            }
            fBound.prototype = new fNOP();

            return fBound;
        };
    }
    /* end-test */

    return $;
}($ || {})); // Take in $ as a dependency. If it has already been declared, add to it,
// if not, create it. Now it doesn't matter what order you load the modules.
