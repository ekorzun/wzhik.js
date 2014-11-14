describe('Whack has cool buit-in syntax shortcodes', function() {

	var tpl, exp;
	
	describe('each function', function() {

		var data = {
			arr : [1,2,3],
			arr2: [4,5,6]
		}

		it('simple array with default "item" variable', function(){
			// no spaces
			tpl = Whack("{{each(data.arr)}}{{= item }}{{ end }}")(data);
			assert.equal(tpl, "123");
			// spaces
			tpl = Whack("{{ each(data.arr) }}{{= item }}{{ end }}")(data);
			assert.equal(tpl, "123");
		});

		it('simple array with custom "item" variable', function(){
			// no spaces
			tpl = Whack("{{each(data.arr,a)}}{{=a}}{{end}}")(data);
			assert.equal(tpl, "123");
			// spaces
			tpl = Whack("{{ each(data.arr, a) }}{{= a }}{{ end }}")(data);
			assert.equal(tpl, "123");
		});

		it('each with brackets', function(){
			tpl = Whack("{{ each(data.arr, a) { }}{{= a }}{{ } }}")(data);
			assert.equal(tpl, "123");
		});

		it('each inside each', function(){
			tpl = Whack("{{ each(data.arr, i) }}{{= i }}{{ each(data.arr2, j) }}{{= j }}{{ end }}{{ end }}")( data );
			assert.equal(tpl, "145624563456");
		});

		it('forEach alias', function(){
			tpl = Whack("{{ forEach(data.arr, i) }}{{= i }}{{ forEach(data.arr2, j) }}{{= j }}{{ end }}{{ end }}")( data );
			assert.equal(tpl, "145624563456");
		});

		it('each break', function(){
			tpl = Whack("{{ each(data.arr, a) { }}{{= a }}{{ break }}{{ end }}")(data);
			assert.equal(tpl, "1");
		});

		it('each first', function(){
			tpl = Whack("{{ each(data.arr, a) { }}{{= a_isFirst ? a : '' }}{{ end }}")(data);
			assert.equal(tpl, "1");
		});

		it('each last', function(){
			tpl = Whack("{{ each(data.arr, a) { }}{{= a_isLast ? a : '' }}{{ end }}")(data);
			assert.equal(tpl, "3");
		});

		it('each even', function(){
			tpl = Whack("{{ each(data.arr, a) { }}{{= a_isEven ? a : '' }}{{ end }}")(data);
			assert.equal(tpl, "2");
		});


	});


	describe('if/else/elseif statements', function() {
		
		it('simple if', function(){
			tpl = Whack("{{ if(true) }}1{{ end }}")();
			assert.equal(tpl, "1");
			tpl = Whack("{{ if(false || true) }}1{{ end }}")();
			assert.equal(tpl, "1");
			tpl = Whack("{{ if( false ) }}1{{ end }}")();
			assert.equal(tpl, "");
		});

		it('if and else', function(){
			tpl = Whack("{{ if(false) }}1{{else}}2{{ end }}")();
			assert.equal(tpl, "2");
			tpl = Whack("{{ if(false && true) }}{{else}}2{{ end }}")();
			assert.equal(tpl, "2");
		});

		it('if and elseif', function(){
			tpl = Whack([
				"{{ if(false) }}",
					1,
				"{{ elseif(true) }}",
					2,
				"{{ end }}"
			].join(""))();
			assert.equal(tpl, "2");

			tpl = Whack([
				"{{ if(false) }}",
					1,
				"{{ elseif(false) }}",
					2,
				"{{ else }}",
					3,
				"{{ end }}"
			].join(""))();
			assert.equal(tpl, "3");
		});

		it('if inside if', function(){
			tpl = Whack([
				"{{ if(false) }}",
					1,
				"{{ elseif(false) }}",
					2,
				"{{ else }}",
					"{{ if( false ) }}",
						99,
					"{{elseif(true)}}",
						"{{if(false)}}",
							4,
						"{{else}}",
							5,
						"{{end}}",
					"{{ end }}",
				"{{ end }}"
			].join(""))();
			assert.equal(tpl, "5");
		});

		it('if inside each', function(){
			tpl = Whack("{{ forEach(data.arr, i) }}{{ if(i > 2) }}{{ forEach(data.arr2, j) }}{{= j }}{{ end }}{{ end }}{{ end }}")({
				arr : [1,2,3],
				arr2: [4,5,6]
			});
			assert.equal(tpl, "456");
		});

	});


	describe('include function', function() {

		var _id = 0;
		function id(t){return "inc" + ( t? ++_id : _id)}

		it('simple include', function(){
			id(true);
			Whack("Hello",  id() );
			tpl = Whack("{{ include "+id()+" }}, World!")();
			assert.equal(tpl, "Hello, World!");
		});

		it('multiple includes', function(){
			id(true);
			Whack("World", id());
			tpl = Whack("{{ include inc1 }}, {{ include inc2 }}!", id(true))();
			assert.equal(tpl, "Hello, World!");
		});

		it('include inside include', function(){
			tpl = Whack("{{ include inc3 }}")();
			assert.equal(tpl, "Hello, World!");
		});

		it('include inside include inside each', function(){
			tpl = Whack("{{each(data.arr)}}{{ include inc3 }}\n{{ end }}")({arr : [1,2,3]});
			assert.equal(tpl, "Hello, World!\nHello, World!\nHello, World!\n");

			tpl = Whack("Hi, {{= name }}<br />", "hitpl");
			var tpl2 = Whack([
				"{{ var names = ['john', 'jack', 'whack'] }}",
				"{{ each(names, name) }}",
					"{{ include hitpl }}",
				"{{ end }}"
			].join(""))();
			assert.equal(tpl2, "Hi, john<br />Hi, jack<br />Hi, whack<br />");
		});

	});


	describe('extends function', function() {
		
		it('basic one-level extends', function() {
			var expect, tpl2, expect2;

			expect = "Parent Header (i am parent) Parent footer";
			expect2 = "Parent Header (i am child) Parent footer";

			tpl = Whack([
				"Parent Header (",
				"{{ block content }}",
					"i am parent",
				"{{ endblock }}",
				") Parent footer"
			].join(""),"parenttpl1")();


			assert.equal( tpl, expect );

			tpl2 = Whack([
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

			tpl = Whack([
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

			tpl2 = Whack([
				"{{ extends parenttpl2 }}",
				"{{ block content }}{{= data.x }} {{ endblock }}",
			].join(""), "childtpl2")({x : "xz"});

			assert.equal( tpl2, expect2 );
		});

	});

});