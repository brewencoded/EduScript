describe('ajax', function() {
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
	
    describe('$.ajax', function() {

        it('should be able to get data', function(done) {
        	$.ajax({
        		url: 'spec/fixtures/test.json',
        		method: 'GET'
        	}, function (data, err) {
  				expect(data.found).toBe('You found me!');
  				expect(err).toBe(null);
        		done();
        	});
        });

        it('should return err if GET resource not found', function (done) {
        	$.ajax({
        		url: 'spec/fixtures/fake.json',
        		method: 'GET'
        	}, function (data, err) {
  				expect(data).toBe(null);
  				expect(err.status).toBe(404);
        		done();
        	});
        });

        it('should be able to post data', function (done) {
        	$.ajax({
        		url: 'https://httpbin.org/post',
        		method: 'POST',
        		data: { message: 'hello' },
        		contentType: 'text/json'
        	}, function (data, err) {
  				expect(JSON.parse(data.data).message).toBe('hello');
  				expect();
        		done();
        	});
        });

        it('should return err if POST resource not found', function (done) {
        	$.ajax({
        		url: 'http://12fak3R.com',
        		method: 'POST',
        		data: { message: 'hello' },
        		contentType: 'text/json'
        	}, function (data, err) {
  				expect(data).toBe(null);
  				expect(err.status).toBe(0);
        		done();
        	});
        });
    });

    describe('$.get', function () {
    	it('should be able to get data', function (done) {
    		$.get('spec/fixtures/test.json', 
        		function (data, err) {
  					expect(data.found).toBe('You found me!');
  					expect(err).toBe(null);
        			done();
        		});
    	});
    });

    describe('$.post', function () {
    	 it('should be able to post data', function (done) {
        	$.post('https://httpbin.org/post', { message: 'hello' }, 'text/json', 
        		function (data, err) {
  					expect(JSON.parse(data.data).message).toBe('hello');
  					expect();
        			done();
        		});
        });
    });
});
