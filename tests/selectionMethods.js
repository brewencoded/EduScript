describe('selection', function() {
    describe('isHTML', function() {
        it('should recognize html', function() {
            expect($.test.isHTML('<div></div>')).toBe(true);
        });
        it('should detect invalid html', function() {
            expect($.test.isHTML('</div>')).toBe(false);
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
    });

});
