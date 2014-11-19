describe('Zippr has cool buit-in syntax shortcodes', function() {

	var tpl, exp;

	// describe('if/else/elseif statements', function() {
		
	// 	it('simple if', function(){
	// 		tpl = Zippr("{{ if(true) }}1{{ end }}")();
	// 		assert.equal(tpl, "1");
	// 		tpl = Zippr("{{ if(false || true) }}1{{ end }}")();
	// 		assert.equal(tpl, "1");
	// 		tpl = Zippr("{{ if( false ) }}1{{ end }}")();
	// 		assert.equal(tpl, "");
	// 	});

	// 	it('if and else', function(){
	// 		tpl = Zippr("{{ if(false) }}1{{else}}2{{ end }}")();
	// 		assert.equal(tpl, "2");
	// 		tpl = Zippr("{{ if(false && true) }}{{else}}2{{ end }}")();
	// 		assert.equal(tpl, "2");
	// 	});

	// 	it('if and elseif', function(){
	// 		tpl = Zippr([
	// 			"{{ if(false) }}",
	// 				1,
	// 			"{{ elseif(true) }}",
	// 				2,
	// 			"{{ end }}"
	// 		].join(""))();
	// 		assert.equal(tpl, "2");

	// 		tpl = Zippr([
	// 			"{{ if(false) }}",
	// 				1,
	// 			"{{ elseif(false) }}",
	// 				2,
	// 			"{{ else }}",
	// 				3,
	// 			"{{ end }}"
	// 		].join(""))();
	// 		assert.equal(tpl, "3");
	// 	});

	// 	it('if inside if', function(){
	// 		tpl = Zippr([
	// 			"{{ if(false) }}",
	// 				1,
	// 			"{{ elseif(false) }}",
	// 				2,
	// 			"{{ else }}",
	// 				"{{ if( false ) }}",
	// 					99,
	// 				"{{elseif(true)}}",
	// 					"{{if(false)}}",
	// 						4,
	// 					"{{else}}",
	// 						5,
	// 					"{{end}}",
	// 				"{{ end }}",
	// 			"{{ end }}"
	// 		].join(""))();
	// 		assert.equal(tpl, "5");
	// 	});

	// 	it('if inside each', function(){
	// 		tpl = Zippr("{{ forEach(data.arr, i) }}{{ if(i > 2) }}{{ forEach(data.arr2, j) }}{{= j }}{{ endeach }}{{ end }}{{ endeach }}")({
	// 			arr : [1,2,3],
	// 			arr2: [4,5,6]
	// 		});
	// 		assert.equal(tpl, "456");
	// 	});

	// });
	
	describe('Each function', function() {


		it('Array: with default "item" variable', function(){
			var templateString = [
				"{{ each(data.arr) }}",
					// The "item" variable is created by default inside each function
					"{{= item }}",
				// Every "each" call must be closed with "endeach" operator
				"{{ endeach }}"
			].join("");
			// Compiling template string to template function
			var template = Zippr(templateString);
			// Executing template
			var result = template({arr : [1,2,3,4,5]});
			// Expected result
			var expected = "12345";
			// Check the result
			assert.equal(result, expected);
		});

		it('Array: with custom "item" variable', function(){
			var templateString = [
				// The "item" variable is created by default inside each function
				// But you specify a custom "item" variable name using 
				// the second argument each each()
				"{{ each(data.arr, number) }}",
					"{{= number }}",
				"{{ endeach }}"
			].join("");
			// Compiling template string to template function
			var template = Zippr(templateString);
			// Executing template
			var result = template({arr : [1,2,3,4,5]});
			// Expected result
			var expected = "12345";
			// Check the result
			assert.equal(result, expected);
		});

		it('Array: with custom "iterator" variable', function(){
			var templateString = [
				// There is no default "iterator" variable you can access inside each
				// Technically it is, but with auto-generated name like "i29"
				// But you can specify it using the third argument for each()
				"{{ each(data.arr, number, iter) }}",
					"{{= iter }}",
				"{{ endeach }}"
			].join("");
			// Compiling template string to template function
			var template = Zippr(templateString);
			// Executing template
			var result = template({arr : ['a','b','c']});
			// Expected result
			var expected = "012";
			// Check the result
			assert.equal(result, expected);
		});

		it('Iterator filters inside for _isFirst, _isLast and _isEven', function(){
			// Iterator's filters are dynamically created variables inside Each function
			// Example:
			// If "item" variable name is default ("item")
			// first will be item_isFirst
			// last will be item_isLast
			// even will be item_isEven
			// odd will be !item_isEven :)
			// If "item" variable name is custom, e.g. ("number")
			// first will be number_isFirst
			// last will be number_isLast
			// even will be number_isEven
			// --------------------------------------------------------
			// First and Last test
			var templateString = [
				"{{ each(data.arr, number) }}",
					// Should print "First" instead of "1"
					"{{ if(number_isFirst) }}",
						"First",
					// Should print "Last" instead of "5"
					"{{ elseif(number_isLast) }}",
						"Last",
					"{{ else }}",
						"{{= number }}",
					"{{ end }}",
				"{{ endeach }}"
			].join("");
			// Compiling template string to template function
			var template = Zippr(templateString);
			// Executing template
			var result = template({arr : [1,2,3,4,5]});
			// Expected result
			var expected = "First234Last";
			// Check the result
			assert.equal(result, expected);
			// --------------------------------------------------------
			// Even test
			var templateString = [
				"{{ each(data.arr, number) }}",
					// Should print only even elements
					"{{ if(number_isEven) }}",
						"{{= number }}",
					"{{ end }}",
				"{{ endeach }}"
			].join("");
			// Compiling template string to template function
			var template = Zippr(templateString);
			// Executing template
			var result = template({arr : [1,2,3,4,5]});
			// Expected result
			var expected = "24";
			// Check the result
			assert.equal(result, expected);
		});


		it('Object: keys and values', function(){
			var templateString = [
				// You can pass Object to for function
				// The second argument will be the value of prop
				// Thse third - prop name
				"{{ each(data, val, key) }}",
					"{{= key }}={{= val }}",
					// cool hack 
					"{{= !val_isLast && ' AND ' }}",
				"{{ endeach }}"
			].join("");
			// Compiling template string to template function
			var template = Zippr(templateString);
			// Executing template
			var result = template({
				hello : 1,
				world : 2,
			});
			// Expected result
			var expected = "hello=1 AND world=2";
			// Check the result
			assert.equal(result, expected);
		});

		it('Each inside each', function(){
			var data = {
				arr1 : [1,2,3],
				arr2 : [4,5,6]
			};
			var templateString = [
				// Feel free to use each inside each inside each etc
				"{{ each(data.arr1, i) }}",
					"{{= i }}",
					// But dont forget about "item" variable
					"{{ each(data.arr2, j) }}",
						"{{= j }}",
					"{{ endeach }}",
				"{{ endeach }}"
			].join("");
			// Compiling template string to template function
			var template = Zippr(templateString);
			// Executing template
			var result = template( data );
			// Expected result
			var expected = "145624563456";
			// Check the result
			assert.equal(result, expected);
		});



		// var data = {
		// 	arr : [1,2,3],
		// 	arr2: [4,5,6]
		// }
		// it('forEach alias', function(){
		// 	tpl = Zippr("{{ forEach(data.arr, i) }}{{= i }}{{ forEach(data.arr2, j) }}{{= j }}{{ endeach }}{{ endeach }}")( data );
		// 	assert.equal(tpl, "145624563456");
		// });

		// it('each break', function(){
		// 	tpl = Zippr("{{ each(data.arr, a) { }}{{= a }}{{ return false }}{{ endeach }}")(data);
		// 	assert.equal(tpl, "1");
		// });

	});


	


	describe('Include function', function() {

		it('Simple include', function(){
			// Zippr passes 2 arguments
			// The first - script element id or template text
			// The second - template name
			// So, "hello-inc" is compiled, stored and ready to use
			Zippr("Hello",  "hello-inc" );
			// Include compiled template hello-inc
			var templateString = "{{ include hello-inc }}, World!";
			// Compiling template with include statement and hello-world-inc id
			var template = Zippr(templateString, "hello-world-inc");
			// 
			var expected = "Hello, World!";
			// result
			var result = template();
			// Check the result
			assert.equal(result, expected);
		});

		it('Multiple and nested includes', function(){
			// including hello-world-inc compiled above
			Zippr("{{ include hello-world-inc }} I'm rich", "rich-inc");
			// new template with include
			var templateString = "{{ include rich-inc }}!";
			var template = Zippr(templateString);
			var expected = "Hello, World! I'm rich!";
			// result
			var result = template();
			// Check the result
			assert.equal(result, expected);
		});


		// it('include inside include inside each', function(){
		// 	tpl = Zippr("{{each(data.arr)}}{{ include inc3 }}\n{{ endeach }}")({arr : [1,2,3]});
		// 	assert.equal(tpl, "Hello, World!\nHello, World!\nHello, World!\n");

		// 	tpl = Zippr("Hi, {{= name }}<br />", "hitpl");
		// 	var tpl2 = Zippr([
		// 		"{{ var names = ['john', 'jack', 'zippr'] }}",
		// 		"{{ each(names, name) }}",
		// 			"{{ include hitpl }}",
		// 		"{{ endeach }}"
		// 	].join(""))();
		// 	assert.equal(tpl2, "Hi, john<br />Hi, jack<br />Hi, zippr<br />");
		// });

	});


	describe('extends function', function() {
		
		it('basic one-level extends', function() {
			var expect, tpl2, expect2;

			expect = "Parent Header (i am parent) Parent footer";
			expect2 = "Parent Header (i am child) Parent footer";

			tpl = Zippr([
				"Parent Header (",
				"{{ block content }}",
					"i am parent",
				"{{ endblock }}",
				") Parent footer"
			].join(""),"parenttpl1")();


			assert.equal( tpl, expect );

			tpl2 = Zippr([
				"{{ extends parenttpl1 }}",
				"{{ block content }}",
					"i am child",
				"{{ endblock }}"
			].join(""), "childtpl1")();

			assert.equal( tpl2, expect2 );
		});


		it('basic one-level extends', function() {
			var expect, tpl2, expect2;

			expect = "Parent Header Parent content Parent footer";
			expect2 = "Parent Header xz Parent footer";

			tpl = Zippr([
				"{{ block header }}",
					"Parent Header ",
				"{{ endblock }}",
				"{{ block content }}",
					"Parent content ",
				"{{ endblock }}",
				"{{ block footer }}",
					"Parent footer",
				"{{ endblock }}",
			].join(""),"parenttpl2")();


			assert.equal( tpl, expect );

			tpl2 = Zippr([
				"{{ extends parenttpl2 }}",
				"{{ block content }}{{= data.x }} {{ endblock }}",
			].join(""), "childtpl2")({x : "xz"});

			assert.equal( tpl2, expect2 );
		});

	});

});