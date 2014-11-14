
describe('Whack can do basic things', function(){

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
			var template = Whack(templateString);
			// Executing template
			var result = template();
			// Expected result
			var expected = "<div><p>Just some text. Hey, I know this is silly but it aids consistency.</p></div>";
			// Check the result
			assert.equal(result, expected);
		});

		it('should return empty string if empty string passed', function(){
			// Compiling empty string
			var template = Whack("");
			var expected = "";
			assert.equal(tpl, exp);
		});


	});


	describe('Interpolate empty values', function(){

		var data = {
			null_val : null,
			false_val : false,
			undefined_val : undefined,
			emptyString_val : ""
		};

		for( var k in data ) {
			+function(k, v){
				it('should return empty string if prop is ' + k.split("_")[0], function(){
					tpl = Whack("{{= data."+k+" }}")( data );
					assert.equal(tpl, "");
				});
			}(k, data[k]);
		}

		it('should return 0 string if prop is 0', function(){
			tpl = Whack("{{= data.zero }}")({zero : 0});
			assert.equal(tpl, "0");
		});


		it('should return empty string if comment', function(){
			tpl = Whack("{{# data.zero }}")({zero : 0});
			assert.equal(tpl, "");
		});
	});


	describe('interpolate plain javascript', function() {
		var data = {
			Num1 : -5,
			Num2 : 100,
			arr : [1,2,3]
		}

		it('should return 3 if Num1 < 3', function(){
			tpl = Whack("{{ if(data.Num1 > 5) { }}{{= 1 }}{{ } else if( data.Num1 > 3 ){ }}{{= 2 }}{{ } else { }}{{= 3 }}{{ } }}")( data );
			exp = "3";
			assert.equal(tpl, exp);
		});

		it('should return 1 if Num2 > 5', function(){
			tpl = Whack("{{ if(data.Num2 > 5) { }}{{= 1 }}{{ } else if( data.Num2 > 3 ){ }}{{= 2 }}{{ } else { }}{{= 3 }}{{ } }}")( data );
			exp = "1";
			assert.equal(tpl, exp);
		});

		it('should return 123 from ' + data.arr + " using for loop", function(){
			tpl = Whack("{{ for(var i = -1; ++i < data.arr.length;) { }}{{= data.arr[i] }}{{ } }}")( data );
			exp = "123";
			assert.equal(tpl, exp);
		});

		it('can use global variables', function(){
			tpl = Whack("{{= globalVariable }}, World!")( data );
			assert.equal(tpl, "Hello, World!");
		});


		it('can interpolate lots of semicolons', function(){
			tpl = Whack("{{ ;;;;;;; }}")( data );
			assert.equal(tpl, "");
		});

		it('can interpolate this', function(){
			tpl = Whack("{{= this.globalVariable }}")( data );
			assert.equal(tpl, "Hello");
		});

		it('should interpolate function once', function(){
			var counter = 0;
			tpl = Whack("{{= data.f() + data.f() }}")({f: function(){return counter++}});
			assert.equal(tpl, "1");
		});

	});


	describe('interpolate strings, newlines, special chars etc', function() {
		
		it('can interpolate single quotes', function(){
			tpl = Whack("It's its, not it's")();
			assert.equal(tpl, "It's its, not it's");
		});

		it('can interpolate double quotes', function(){
			tpl = Whack('It"s its, not it"s')();
			assert.equal(tpl, 'It"s its, not it"s');
		});

		it('can interpolate mixed quotes', function(){
			tpl = Whack('It"s it\'s, not it"s')();
			assert.equal(tpl, 'It"s it\'s, not it"s');
		});

		it('can interpolate quotes inside plain js', function(){
			tpl = Whack("{{ if(data.foo == 'bar'){ }}Statement quotes and 'quotes'.{{ } }}")({foo:"bar"});
			assert.equal(tpl, "Statement quotes and 'quotes'.");
		});

		it('can interpolate backslashes', function(){
			tpl = Whack("{{= data.thing }} is \\ridanculous")({thing : "This"});
			assert.equal(tpl, "This is \\ridanculous");
		});

		// it('can interpolate spaces and newlines', function(){
		// 	tpl = Whack("This\n\t\tis: {{= data.x }}.\n\tok.\nend.")({x : "that"});
		// 	assert.equal(tpl, "This\n\t\tis: that.\n\tok.\nend.");
		// });

		
	});

});