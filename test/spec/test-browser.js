describe('Whack can do basic things', function(){

	describe('Interpolate nothing', function(){
		
		it('should return empty string if empty string passed', function(){
			// Compiling empty string
			var template = Whack("#test-simple");
			template();
		});


	});
});