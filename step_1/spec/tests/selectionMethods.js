describe('selection', function() {
    function click(el) {
        var ev = document.createEvent("MouseEvent");
        ev.initMouseEvent(
            "click",
            true /* bubble */ , true /* cancelable */ ,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, false, false, /* modifier keys */
            0 /*left*/ , null
        );
        el.dispatchEvent(ev);
    }
    describe('isHTML', function() {
        it('should recognize html', function() {
            expect($.test.isHTML('<div></div>')).toBe(true);
            expect($.test.isHTML('<input type="text" id="test">')).toBe(true);
        });
        it('should detect invalid html', function() {
            expect($.test.isHTML('</div>')).toBe(false);
            expect($.test.isHTML('h1')).toBe(false);
        });
        it('should detect strings', function() {
            expect($.test.isHTML('this is a string')).toBe(false);
        });
    });

    describe('getTag', function() {
        it('should return the tag from html string', function() {
            expect($.test.getTag('<div></div>')).toBe('div');
        });
    });

    describe('getAttrs', function() {
        it('should return map of attributes from html string', function() {
            var htmlStr = '<div id="myId" class="myClass" data-attribute></div>';
            var expectedObject = {
                id: 'myId',
                class: 'myClass',
                'data-attribute': ''
            };

            expect($.test.getAttrs(htmlStr)).toEqual(expectedObject);
        });
    });

    describe('getText', function () {
    	it('should get text inbetween tag', function () {
    		var htmlStr = '<p>This is some text</p>';
    		expect($.test.getText(htmlStr)).toBe('This is some text');
    	});
    });

    describe('$.elem', function() {
        var $elem;
        beforeEach(function() {
            $elem = $.elem('<div id="myId" class="myClass"></div>');
        });

        it('should return an JElement object', function() {
            expect($elem).toEqual(jasmine.any($.test.JElement));
        });
        describe('finding existing element', function() {
            var testElement, testElementTwo;

            beforeEach(function() {
                testElement = document.createElement('div');
                testElement.setAttribute('class', 'myClass');
                testElement.setAttribute('id', 'testId');

                testElementTwo = document.createElement('div');
                testElementTwo.setAttribute('class', 'myClass');
                testElementTwo.setAttribute('id', 'testIdTwo');

                document.body.appendChild(testElement);
                document.body.appendChild(testElementTwo);
            });
            afterEach(function() {
                document.body.removeChild(testElement);
                document.body.removeChild(testElementTwo);
            });
            it('should find element on the page and create an Element', function() {
                var result = $.elem('#testId');
                expect(result).toEqual(jasmine.any($.test.JElement));
                expect(result.getNode()).toEqual(jasmine.any(Node));
                expect(testElement).toEqual(result.getNode());
            });
            it('should get an array for multiple elements', function() {
                var result = $.elem('.myClass');
                expect(result.length > 0).toBe(true);
                expect(result[0]).toEqual(jasmine.any($.test.JElement));
            });
            it('should pull in all attributes from existing element', function() {
                var result = $.elem('#testId');
                expect(result.attr('id')).toBe('testId');
                expect(result.attr('class')).toBe('myClass');
            });
        });
        describe('attr', function() {
            it('should return correct id', function() {
                expect($elem.attr('id')).toBe('myId');
            });
            it('should return correct class', function() {
                expect($elem.attr('class')).toBe('myClass');
            });
            it('should change atttribute to supplied value', function() {
                $elem.attr('id', 'newId');
                expect($elem.attr('id')).toBe('newId');
            });
        });

        describe('JElement', function() {
            it('should create a node on instantiation', function() {
                expect($elem.getNode()).toEqual(jasmine.any(Node));
            });
            it('should have correct attributes', function() {
                var node = $elem.getNode();
                expect(node.id).toBe('myId');
                expect(node.getAttribute('class')).toBe('myClass');
            });
        });

        describe('Input', function() {
            it('should have different event types', function() {
                var e = new $.test.JElement('div', {
                    class: 'myClass'
                });
                var i = new $.test.Input({
                    class: 'myClass'
                });
                expect(e.eventTypes.indexOf('input') === -1).toBe(true);
                expect(i.eventTypes.indexOf('input') > -1).toBe(true);
            });
        });

        describe('on and off', function() {
            var div, divTwo;
            beforeEach(function() {
                document.body.appendChild($elem.getNode());
                div = $.elem('#myId');
                window.successfullyTriggeredEvent = false;
            });
            afterEach(function() {
                document.body.removeChild($elem.getNode());
                window.successfullyTriggeredEvent = false;
            });
            it('should add events to instance and element', function() {
                div.on('click', function() {
                    window.successfullyTriggeredEvent = true;
                });
                expect(div.listeners.length).toBe(1);
                expect(div.listeners[0]).toBeDefined();
                expect(div.listeners[0].handler).toEqual(jasmine.any(Function));
            });
            it('should remove events from instance and element', function() {
                div.on('click', function() {
                    window.successfullyTriggeredEvent = true;
                });
                div.off('click');
                expect(div.listeners.length).toBe(0);
                expect(div.listeners[0]).not.toBeDefined();
            });
            it('should execute event', function() {
                div.on('click', function() {
                    window.successfullyTriggeredEvent = true;
                });
                click(div.getNode());
                expect(window.successfullyTriggeredEvent).toBe(true);
            });
            it('should add and remove multiple events at once', function() {
            	div.on('click', function() {
                    window.successfullyTriggeredEventOne = true;
                }).on('click', function() {
                    window.successfullyTriggeredEventTwo = true;
                });
                expect(div.listeners[0].event).toBe('click');
                expect(div.listeners[1].event).toBe('click');
                expect(div.listeners.length).toBe(2);
                div.off('click');
                expect(div.listeners.length).toBe(0);
            });
            it('should throw error if event does not exist', function () {
            	expect(function() { 
					div.off('click'); 
				}).toThrowError($.test.NoSuchEventException);
            });
        });

        describe('append', function () {
        	var div;
        	beforeEach(function () {
        		document.body.appendChild($elem.getNode());
        		div = $.elem('#myId');
        	});
        	afterEach(function () {
        		document.body.removeChild($elem.getNode());
        	});

        	it('should convert an html string to html and append it', function () {
        		div.append('<p>Hello</p>');
        		expect(div.getNode().childNodes[0]).toBeDefined();
        	});

        	it('should append an JElement to an html element', function () {
        		var appendee = $.elem('<p>Hello</p>');
        		div.append(appendee);
        		expect(div.getNode().childNodes[0]).toBeDefined();
        	});

        	it('should append a Node to an html element', function () {
        		var appendee = document.createElement('p');
        		appendee.appendChild(document.createTextNode('Hello'));
        		div.append(appendee);
        		expect(div.getNode().childNodes[0]).toBeDefined();
        	});

        	it('should append a plain string html element', function () {
        		div.append('Hello');
        		expect(div.getNode().childNodes[0]).toBeDefined();
        	});
        });
    });

	describe('$.extend', function () {
		it('should take multiple object arguments and return a single merge object', function () {
			var one = {
				a: 'A'
			};
			var two = {
				b: 'B',
				c: 'C'
			};
			var three = {
				d: 'D',
				e: 'E',
				f: 'F'
			};

			var expected = {
				a: 'A',
				b: 'B',
				c: 'C',
				d: 'D',
				e: 'E',
				f: 'F'
			};
			var merged = $.extend(one, two, three);
			expect(merged).toEqual(expected);
		});
	});

});
