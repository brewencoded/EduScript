describe('$', function () {
	it('exists', function () {
		expect($).toBeDefined();
	});

	describe('$.get', function () {
		it('exits', function () {
			expect($.get).toBeDefined();
		});
	});

	describe('$.ajax', function () {
		it('exists', function () {
			expect($.ajax).toBeDefined();
		});
	});

	describe('$.test', function () {
		it('exists', function () {
			expect($.test).toBeDefined();
		});

		describe('isHTML', function () {
			it('exists', function () {
				expect($.test.isHTML).toBeDefined();
			});
		});
	});
});