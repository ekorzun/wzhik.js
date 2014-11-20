
describe("We hope that you will not need this part", function(){

	var tpl, exp;


	describe('Interpolate plain javascript', function() {
		var data = {
			Num1 : -5,
			Num2 : 100,
			arr : [1,2,3]
		}

		it('Plain js if statements', function(){
			// It is bad idea to use plain js If statements, because of cool Wzhik shortcodes (see above)
			// But we had to test it
			// You can skip it
			var templateString = "{{ if(data.Num1 > 5) { }}{{= 1 }}{{ } else if( data.Num1 > 3 ){ }}{{= 2 }}{{ } else { }}{{= 3 }}{{ } }}";
			var template = Wzhik(templateString);
			var expected = "3";
			var result = template({Num1: -5});

			var templateString2 = "{{ if(data.Num2 > 5) { }}{{= 1 }}{{ } else if( data.Num2 > 3 ){ }}{{= 2 }}{{ } else { }}{{= 3 }}{{ } }}";
			var template2 = Wzhik(templateString2);
			var expected2 = "1";
			var result2 = template2({Num2: 100});

			// Check the result
			assert.equal(result, expected);
			assert.equal(result2, expected2);
		});

		it('should return 123 from [' + data.arr + "] using for loop", function(){
			// It is bad idea to use plain js loop, because of cool Wzhik shortcodes (see above)
			// But we had to test it
			// You can skip it
			var templateString = [
				"{{ for(var i = -1; ++i < data.arr.length;) { }}",
					"{{= data.arr[i] }}",
				"{{ } }}"
			].join("");
			var template = Wzhik(templateString);
			var result = template({arr: [1,2,3]});
			var expected = "123";
			// Check the result
			assert.equal(result, expected);
		});

		it('Can use global variables', function(){
			// window.globalVariable = "Hello"
			var templateString = "{{= globalVariable }}, World!";
			var template = Wzhik(templateString);
			var result  = template();
			var expected = "Hello, World!";
			// Check the result
			assert.equal(result, expected);
		});


		it('Can interpolate lots of semicolons', function(){
			var templateString = "{{ ;;;;;;;;;;;;;;; }}";
			var template = Wzhik(templateString);
			var result  = template();
			var expected = "";
			// Check the result
			assert.equal(result, expected);
		});

		it('Can interpolate this', function(){
			// window.globalVariable = "Hello"
			var templateString = "{{= this.globalVariable }}, World!";
			var template = Wzhik(templateString);
			var result  = template();
			var expected = "Hello, World!";
			// Check the result
			assert.equal(result, expected);
			// Second test
			var obj = {globalVariable : "Good bye"};
			result = template.call(obj);
			expected =  "Good bye, World!";
			// Check the result
			assert.equal(result, expected);
		});

		it('Should interpolate function once', function(){
			var counter = 0;
			var templateString = "{{= data.f() }}";
			var template = Wzhik(templateString);
			var result  = template({f: function(){return ++counter}});
			var expected = "1";
			// Check the result
			assert.equal(result, expected);
		});

	});


	describe('interpolate strings, newlines, special chars etc', function() {
		
		it('can interpolate single quotes', function(){
			var templateString = "It's its, not it's";
			var template = Wzhik(templateString);
			var result  = template();
			var expected = "It's its, not it's";
			// Check the result
			assert.equal(result, expected);
		});

		it('can interpolate double quotes', function(){
			var templateString = 'It"s its, not it"s';
			var template = Wzhik(templateString);
			var result  = template();
			var expected = 'It"s its, not it"s';
			// Check the result
			assert.equal(result, expected);
		});

		it('can interpolate mixed quotes', function(){
			var templateString = 'It"s it\'s, not it"s';
			var template = Wzhik(templateString);
			var result  = template();
			var expected = 'It"s it\'s, not it"s';
			// Check the result
			assert.equal(result, expected);
		});

		it('can interpolate backslashes', function(){
			var templateString = "{{= data.thing }} is \\ridanculous";
			var template = Wzhik(templateString);
			var result  = template({thing : "This"});
			var expected = "This is \\ridanculous";
			// Check the result
			assert.equal(result, expected);
		});

		// result = Wzhik([
		// 		"{{ if(data.foo == 'bar') }}",
		// 			"Statement quotes and 'quotes' and ",
		// 			"{{= data.foo }}",
		// 		"{{ end }}"
		// 	].join(""))({foo: '"bar"'});
		// 	expected = "Statement quotes and \'quotes\' and \"bar\"";
		// 	assert.equal(result, expected);

		// it('can interpolate spaces and newlines', function(){
		// 	tpl = Wzhik("This\n\t\tis: {{= data.x }}.\n\tok.\nend.")({x : "that"});
		// 	assert.equal(tpl, "This\n\t\tis: that.\n\tok.\nend.");
		// });

		
	});

});