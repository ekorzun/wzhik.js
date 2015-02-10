
describe('wzhik can do basic things', function(){

	var tpl, exp;
	globalVariable = "Hello";

	describe('Interpolate nothing', function(){
		
		it('Return same text if there is no special markup', function(){
			var templateString = [
				"<div>",
					"<p>",
						"Just some text. Hey, I know this is silly but it aids consistency.",
					"</p>",
				"</div>"
			].join("");
			// Compiling template string to template function
			var template = wzhik(templateString);
			// Executing template
			var result = template.render();
			// Expected result
			var expected = "<div><p>Just some text. Hey, I know this is silly but it aids consistency.</p></div>";
			// Check the result
			assert.equal(result, expected);
		});

		it('Should return empty string if empty string passed', function(){
			// Compiling empty string
			var template = wzhik("");
			// Expecting empty string 
			var expected = "";
			var result = template.render();
			// Check the result
			assert.equal(result, expected);
		});


	});


	describe('Interpolate empty values', function(){

		it('Should return empty string if prop is undefined', function(){
			var templateString = "{{= data.foo }}";
			// Compiling template string to template function
			var template  = wzhik(templateString);
			// Executing template
			var result = template.render({foo : undefined});
			// Check the result
			assert.equal(result, "");
			// Second test
			var undef;
			result = template.render({foo : undef});
			assert.equal(result, "");
		});

		it('Should return empty string if prop is false', function(){
			var templateString = "{{= data.foo }}";
			// Compiling template string to template function
			var template  = wzhik(templateString);
			// Executing template
			var result = template.render({foo : false});
			// Check the result
			assert.equal(result, "");
		});

		it('Should return empty string if prop is null', function(){
			var templateString = "{{= data.foo }}";
			// Compiling template string to template function
			var template  = wzhik(templateString);
			// Executing template
			var result = template.render({foo : null});
			// Check the result
			assert.equal(result, "");
		});

		it('Should return empty string if prop is empty string', function(){
			var templateString = "{{= data.foo }}";
			// Compiling template string to template function
			var template  = wzhik(templateString);
			// Executing template
			var result = template.render({foo : ""});
			// Check the result
			assert.equal(result, "");
		});

		it('Should return 0 if prop is 0', function(){
			var templateString = "{{= data.foo }}";
			// Compiling template string to template function
			var template  = wzhik(templateString);
			// Executing template
			var result = template.render({foo : 0});
			// Check the result
			assert.equal(result, "0");
		});

		it('Should return empty string if comment', function(){
			// {{# any text here }}
			var templateString = "{{# data.foo will not be here }}";
			// Compiling template string to template function
			var template  = wzhik(templateString);
			// Executing template
			var result = template.render({foo : "bar"});
			// Check the result
			assert.equal(result, "");
		});

	});


});