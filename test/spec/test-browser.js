describe('Zippr can pzdc', function(){

	it('should return empty string if empty string passed', function(){
		// Compiling empty string
		var template = Zippr("#test-simple");
		var data = {arr : [1,2,3], "xxx" : "OOO"}
		template( data );
	});


	// it('should ', function(){
	// 	var data = {
	// 		arr : [
	// 			{i : 1},
	// 			{i : 2},
	// 			{i : 3, c : [
	// 				{i : 31},
	// 				{i : 32}
	// 			]},
	// 			{i : 4}
	// 		]
	// 	}
	// 	// Compiling empty string
	// 	var template = Zippr("#test-recursive");
	// 	template( data );
	// });


});