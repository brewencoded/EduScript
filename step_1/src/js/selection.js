var $ = (function($) {
    /**
     * Error to be thrown when no matching event is found on Element
     */
    function NoSuchEventException(message) {
        this.name = 'NoSuchEventException';
        this.message = message;
        this.stack = (new Error()).stack;
    }
    NoSuchEventException.prototype = Object.create(Error.prototype);

    function NotUseableHtmlObjectException(message) {
        this.name = 'NotUseableHtmlObjectException';
        this.message = message;
        this.stack = (new Error()).stack;
    }
    NotUseableHtmlObjectException.prototype = Object.create(Error.prototype);

    ////////////////////////////////////////////////////////////////////////////////////////////
    /// Private Utility Functions
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
     * Strips text content from tag
     * @param  {string} str - html string
     * @return {string}     text from inside of tag
     */
    function getText(str) {
        var first = str.indexOf('>');
        first++;
        var last = str.indexOf('<', 1);
        var text = str.slice(first, last);

        return text;
    }
    /**
     * Searches DOM using CSS selectors
     * @param  {string} selector     - selector to use in search
     * @return {Object|Object[]|false} JElement or JElement[] representing element(s) found or false if no match
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
     * @return {JElement|Input}      Input for input or select elements, JElement for all others
     */
    function createExistingElement(node) {
        var tag = node.tagName;
        var attrs = {};
        var content = node.childNodes[0];
        var existingElement;

        for (var attr in node.attributes) {
            if (node.attributes.hasOwnProperty(attr)) {
                attrs[node.attributes[attr].name] = node.attributes[attr].value;
            }
        }
        if (tag === 'input' || tag === 'select') {
            existingElement = new Input(attrs, node);
        } else {
            if (content !== '' && content !== undefined) {
            	if(typeof content === 'object') {
            		existingElement = new JElement(tag, attrs, node, "");
            	} else {
                	existingElement = new JElement(tag, attrs, node, content);
                }
            } else {
                existingElement = new JElement(tag, attrs, node);
            }

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
    function JElement(tag, attrs, node, content) {
        this.tag = tag;
        this.attrs = attrs;
        this.listeners = [];
        this.node = node || this.createNode();

        if (content) {
            this.node.appendChild(document.createTextNode(content));
        }
    }
    JElement.prototype = {
        eventTypes: ['click', 'blur', 'hover', 'keyup', 'focus', 'keydown', 'mouseup', 'mousedown', 'mouseleave', 'scroll'],
        /**
         * add event handler to element
         * @param  {string} event     - event name
         * @param  {Function} handler - function to use on event
         * @return {Object}             returns element object
         */
        on: function(event, handler) {
            this.node.addEventListener(event, handler);
            this.listeners.push({
                event: event,
                handler: handler
            });

            return this; //method chaining
        },
        /**
         * remove event handler from element
         * @param {string} event  - event name
         * @param {Function} fn   - function to remove
         * @return {Object}         returns element object
         */
        off: function(event, fn) {
            var handlers = [];
            var i = this.listeners.length,
                ii;
            while (i--) { //loop backwards. splice redefines array indexes
                if (this.listeners[i].event === event) {
                    handlers.push(this.listeners[i].handler);
                    this.listeners.splice(i, 1); //remove element from array
                }
            }
            if (fn) {
                this.node.removeEventListener(event, fn);
            } else {
                if (handlers.length === 0) {
                    throw new NoSuchEventException('Event is not present in element');
                } else if (handlers.length === 1) {
                    this.node.removeEventListener(event, handlers[0]);
                } else {
                    for (ii in handlers) {
                        this.node.removeEventListener(event, handlers[ii]);
                    }
                }
            }

            return this; //method chaining
        },
        /**
         * Appends argument to the Element this method is invoked on
         * @param  {string|Object} elementOrString - Either a string, Element, or Node
         * @return {Object}                 		 returns Element
         */
        append: function(elementOrString) {
            if (typeof elementOrString === 'string') {
                if (isHTML(elementOrString)) {
                    var elem = $.elem(elementOrString);
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
                    throw new NotUseableHtmlObjectException('The value is not a valid html string, Node, or Element');
                }
            }

            return this; //method chaining woot!
        },

        /**
         * Gets or sets attribute of element
         * @param  {string} attr  - attribute to set or get
         * @param  {string} value - value to change attribute to
         * @return {Object}         returns Node object
         */
        attr: function(attr, value) {
            if (value) {
                this.attrs[attr] = value;

                return this; //method chaining
            } else {

                return this.attrs[attr];
            }
        },
        /**
         * Creates Node object 
         * @return {Object} Node object
         */
        createNode: function() {
            var node = document.createElement(this.tag);
            for (var key in this.attrs) {
                if (this.attrs.hasOwnProperty(key)) {
                    node.setAttribute(key, this.attrs[key]);
                }
            }

            return node;
        },
        /**
         * Gets the node representation of the object
         * @return {Object} Node
         */
        getNode: function() {

            return this.node;
        },
        /**
         * Removes the node from the DOM
         * @return {Object} reference to the removedd object as a JElement
         */
        remove: function() {
            this.node.parentNode.removeChild(this.node);

            return this;
        }
    };
    /**
     * Constructor for Input type. Inherits from JElement
     * @param {Object} attrs - attributes to pass to parent
     */
    function Input(attrs, node) {
        JElement.call(this, 'input', attrs, node);
        this.value = attrs.value || '';
        Input.prototype.eventTypes = this.eventTypes.concat(['input', 'change']);

        this.node.addEventListener('keyup', function(e) {
            this.value = e.target.value;
        }.bind(this));

    }


    Input.prototype = Object.create(JElement.prototype);
    Input.prototype.constructor = Input;

    ////////////////////////////////////////////////////////////////////////////////////////////
    /// Public Utility Functions
    ////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Variadic function. Takes multiple objects and combines them into a single  object. shallow merge.
     * @return {Object} merged objects
     */
    $.extend = function() {

        // Variables
        var extended = {};
        var i;
        var length = arguments.length; //arguments has pretty bad performance, don't overuse it

        // Merge the object into the extended object
        var merge = function(obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    extended[prop] = obj[prop];
                }
            }
        };

        // Loop through each object and conduct a merge
        for (i = 0; i < length; i++) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;
    };


    ////////////////////////////////////////////////////////////////////////////////////////////
    /// Inititializers
    ////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * JElement creation or searching (does not yet support nested elements)
     * @param  {string} str          - html string or selector
     * @return {Object|Object[]|false} one or more objects or false for search and Element if creating
     */
    $.elem = function(str) {
        var attrs;
        var tag;
        var content;
        if (isHTML(str)) {
            if (getTag(str) === 'input') {
                attrs = getAttrs(str);

                return new Input(attrs);
            } else {
                tag = getTag(str);
                attrs = getAttrs(str);
                content = getText(str);

                return new JElement(tag, attrs, null, content);
            }
        } else {

            return findElement(str);
        }
    };
    
    //expose the prototype to allow for extending  
    $.fn = JElement.prototype;

    ////////////////////////////////////////////////////////////////////////////////////////////
    /// Test Code : stripped out during build
    ////////////////////////////////////////////////////////////////////////////////////////////

    /* start-test */
    $.test = {
        Mimic: 'some test code',
        isHTML: isHTML,
        getTag: getTag,
        getAttrs: getAttrs,
        getText: getText,
        JElement: JElement,
        Input: Input,
        NoSuchEventException: NoSuchEventException
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
                FNOP = function() {},
                fBound = function() {
                    return fToBind.apply(this instanceof FNOP ? this : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            if (this.prototype) {
                // native functions don't have a prototype
                FNOP.prototype = this.prototype;
            }
            fBound.prototype = new FNOP();

            return fBound;
        };
    }
    /* end-test */

    return $;
}($ || {})); // Take in $ as a dependency. If it has already been declared, add to it,
// if not, create it. Now it doesn't matter what order you load the modules.
