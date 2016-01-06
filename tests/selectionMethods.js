describe('selection', function() {
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

    describe('$.elem', function() {
        var $elem;
        beforeEach(function() {
            $elem = $.elem('<div id="myId" class="myClass"></div>');
        });

        it('should return an Element object', function() {
            expect($elem).toEqual(jasmine.any($.test.Element));
        });
        describe('finding existing element', function () {
        	var testElement, testElementTwo;

        	beforeEach(function () {
        		testElement = document.createElement('div');
        		testElement.setAttribute('class', 'myClass');
        		testElement.setAttribute('id', 'testId');

        		testElementTwo = document.createElement('div');
        		testElementTwo.setAttribute('class', 'myClass');
        		testElementTwo.setAttribute('id', 'testIdTwo');

        		document.body.appendChild(testElement);
        		document.body.appendChild(testElementTwo);
        	});
        	afterEach(function () {
        		document.body.removeChild(testElement);
        		document.body.removeChild(testElementTwo);
        	});
        	it('should find element on the page and create an Element', function () {
        		var result = $.elem('#testId');
        		expect(result).toEqual(jasmine.any($.test.Element));
        		expect(result.getNode()).toEqual(jasmine.any(Node));
        		expect(testElement).toEqual(result.getNode());
        	});
        	it('should get an array for multiple elements', function () {
        		var result = $.elem('.myClass');
        		expect(result.length > 0).toBe(true);
        		expect(result[0]).toEqual(jasmine.any($.test.Element));
        	});
        	it('should pull in all attributes from existing element', function () {
        		var result = $.elem('#testId');
        		expect(result.attr('id')).toBe('testId');
        		expect(result.attr('class')).toBe('myClass');
        	});
        });
        describe('attr', function() {
        	it('should return correct id', function () {
        		expect($elem.attr('id')).toBe('myId');
        	});
        	it('should return correct class', function () {
        		expect($elem.attr('class')).toBe('myClass');
        	});
        	it('should change atttribute to supplied value', function () {
        		$elem.attr('id', 'newId');
        		expect($elem.attr('id')).toBe('newId');
        	});
        });

        describe('Element', function () {
        	it('should create a node on instantiation', function () {
        		expect($elem.getNode()).toEqual(jasmine.any(Node));
        	});
        	it('should have correct attributes', function () {
        		var node = $elem.getNode();
        		expect(node.id).toBe('myId');
        		expect(node.getAttribute('class')).toBe('myClass');
        	});
        });

        describe('Input', function () {
        	it('should have different event types', function () {
        		var e = new $.test.Element('div', {class:'myClass'});
        		var i = new $.test.Input({class:'myClass'});
        		expect(e.eventTypes.indexOf('input') === -1).toBe(true);
        		expect(i.eventTypes.indexOf('input') > -1).toBe(true);
        	});
        });
    });

});
