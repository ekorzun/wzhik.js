
module("Simple templates");


test("underscore pizding tests", function(){
	var basicTemplate = testTPL("{{= data.thing }} is gettin' on my noives!");
    var result = basicTemplate({thing : 'This'});
    equal(result, "This is gettin' on my noives!", 'can do basic attribute interpolation');

    var sansSemicolonTemplate = testTPL("A {{ this }} B");
    equal(sansSemicolonTemplate(), "A  B");

    var backslashTemplate = testTPL("{{= data.thing }} is \\ridanculous");
    equal(backslashTemplate({thing: 'This'}), "This is \\ridanculous");

    // var escapeTemplate = testTPL('{{~ data.a ? "checked=\\"checked\\"" : "" }}');
    // equal(escapeTemplate({a: true}), 'checked="checked"', 'can handle slash escapes in interpolations.');

    var fancyTemplate = testTPL(
    	"<ul>",
    		"{{ each(data.people, man) }}",
    			"<li>{{= man }}</li>",
    		"{{ end }}",
    	"</ul>"
    );
    result = fancyTemplate({people : ["Moe", "Larry","Curly"]});
    equal(
    	result,
    	"<ul><li>Moe</li><li>Larry</li><li>Curly</li></ul>",
    	'can run arbitrary javascript in templates'
    );

    // var escapedCharsInJavascriptTemplate = testTPL(
    // 	"<ul>",
    // 		"{{ var n = data.numbers.split(\"\\n\") }}",
    // 		"{{ each(n) }}",
    // 			"<li>{{= item }}</li>",
    // 		"{{ end }}",
    // 	"</ul>"
    // );
    // result = escapedCharsInJavascriptTemplate({numbers: "one\ntwo\nthree\nfour"});
    // equal(result, "<ul><li>one</li><li>two</li><li>three</li><li>four</li></ul>", 'Can use escaped characters (e.g. \\n) in Javascript');


    // var namespaceCollisionTemplate = testTPL("{{= data.pageCount }} {{= data.thumbnails[data.pageCount] }} {{ each(thumbnails, p) }}<div class=\"thumbnail\" rel=\"{{= p }}\"></div>{{ end }}");
    // result = namespaceCollisionTemplate({
    //   pageCount: 3,
    //   thumbnails: {
    //     1: "p1-thumbnail.gif",
    //     2: "p2-thumbnail.gif",
    //     3: "p3-thumbnail.gif"
    //   }
    // });
    // equal(result, "3 p3-thumbnail.gif <div class=\"thumbnail\" rel=\"p1-thumbnail.gif\"></div><div class=\"thumbnail\" rel=\"p2-thumbnail.gif\"></div><div class=\"thumbnail\" rel=\"p3-thumbnail.gif\"></div>");


    var noInterpolateTemplate = testTPL("<div><p>Just some text. Hey, I know this is silly but it aids consistency.</p></div>");
    result = noInterpolateTemplate();
    equal(result, "<div><p>Just some text. Hey, I know this is silly but it aids consistency.</p></div>");

    var quoteTemplate = testTPL("It's its, not it's");
    equal(quoteTemplate({}), "It's its, not it's");

    var quoteInStatementAndBody = testTPL("{{\
      if(data.foo == 'bar'){ \
    }}Statement quotes and 'quotes'.{{ } }}");
    equal(quoteInStatementAndBody({foo: "bar"}), "Statement quotes and 'quotes'.");

    var withNewlinesAndTabs = testTPL('This\n\t\tis: {{= data.x }}.\n\tok.\nend.');
    equal(withNewlinesAndTabs({x: 'that'}), 'This\n\t\tis: that.\n\tok.\nend.');

    // @todo move escape to "-" operator
    var template = testTPL("<i>{{= data.value | escapeHTML }}</i>");
    var result = template({value: "<script>"});
    equal(result, '<i>&lt;script&gt;</i>');


    var stooge = {
      name: "Moe",
      template: testTPL("I'm {{= this.name }}")
    };
    equal(stooge.template(), "I'm Moe");


    var mustache = testTPL("Hello {{= data.planet }}!");
    equal(mustache({planet : "World"}), "Hello World!", "can mimic mustache.js");

    // var templateWithNull = testTPL("a null undefined {{planet}}");
    // equal(templateWithNull({planet : "world"}), "a null undefined world", "can handle missing escape and evaluate settings");
});


// test('provides the generated function source, when a SyntaxError occurs', function() {
//     try {
//       testTPL('<b>{{ if x  }}</b>');
//     } catch (ex) {
//       var source = ex.source;
//       console.error(source)
//     }
//     ok(/_o/.test(source));
// });

test('result calls functions and returns primitives', function() {
	var obj = {w: '', x: 'x', y: function(){ return this.x; }};
	strictEqual(testTPL('{{= data.w }}')(obj), '');
	strictEqual(testTPL('{{= data.x }}')(obj), 'x');
	strictEqual(testTPL('{{= data.y() }}')(obj), 'x');
	strictEqual(testTPL('{{= data.z }}')(obj), "");
});


test('undefined template variables.', function() {
	var template = testTPL('{{= data.x }}');
	strictEqual(template({x: null}), '');
	strictEqual(template({x: undefined}), '');

	// var templateEscaped = testTPL('{{~ data.x }}');
	// strictEqual(templateEscaped({x: null}), '');
	// strictEqual(templateEscaped({x: undefined}), '');

	var templateWithProperty = testTPL('{{= data.x.foo }}');
	strictEqual(templateWithProperty({x: {} }), '');
	strictEqual(templateWithProperty({x: {} }), '');
});

test('interpolate evaluates code only once.', function() {
	var count = 0;
	var template = testTPL('{{= data.f()  }}');
	template({f: function(){ ok(!(count++)); }});
});



test( "variables and expressions", function() {
	var tpl, expect;

	expect = "<div>hello, world</div>";
	tpl = testTPL(
		"{{ var x = 'hello, world' }}",
		"<div>{{= x }}</div>"
	)();
	ok(expect == tpl, "simple expr passed");


	expect = "<div>hi, dude</div>";
	tpl = testTPL(
		"{{ var x = 'hi, world' }}",
		"<div>{{= x.replace('hello', 'hi').replace(\"world\", 'dude') }}</div>"
	)();
	ok(expect == tpl, "simple expr with quotes passed");


	expect = "2 + 2 = 4";
	tpl = testTPL("2 + 2 = {{=(2 + 2)}}")();
	ok(expect == tpl, "simple multiple exprs passed");


	expect = "2 + 2 = 4";
	tpl = testTPL("{{=data.x}} + {{=data.x}} = {{=(data.x+data.x)}}")({x : 2});
	ok(expect == tpl, "simple data exprs passed");


	expect = "1,2,3,4,5";
	var array = [1,2,3,4,5];

	tpl = testTPL("{{ var array = [1,2,3,4,5] }}{{= array }}")();
	ok(expect == tpl, "array to string passed");


	tpl = testTPL("{{= data.array }}")({array: array});
	ok(expect == tpl, "array to string passed");


	expect = "4 < 8";
	tpl = testTPL(
		"{{= data.four() + ' < ' + data.eight()}}"
	)({
		four : function(){return 4},
		eight : function(){return 8}
	});
	ok(expect == tpl, "function expressions passed");


});



test( "if/else", function() {
	var tpl, expect;

	expect = "50";
	tpl = testTPL(
		"{{ if( data.i > 5) }}",
			"{{= data.i * 5 }}",
		"{{ end }}"
	)({i : 10});
	ok(expect == tpl, "whack if passed");


	expect = "50";
	tpl = testTPL(
		"{{ if( data.i > 5) { }}",
			"{{= data.i * 5 }}",
		"{{ } }}"
	)({i : 10});
	ok(expect == tpl, "js if passed");


	expect = "10";
	tpl = testTPL(
		"{{ if( data.i > 50) }}",
			"{{= data.i * 5 }}",
		"{{ else }}",
			"{{= data.i }}",
		"{{ end }}"
	)({i : 10});
	ok(expect == tpl, "whack if/else passed");


	expect = "10";
	tpl = testTPL(
		"{{ if( data.i > 50) { }}",
			"{{= data.i * 5 }}",
		"{{ } else { }}",
			"{{= data.i }}",
		"{{ } }}"
	)({i : 10});
	ok(expect == tpl, "js if/else passed");

});




test("loops", function(){
	var expect, tpl;

	expect = "a,b,c,d,e,";
	var array = ["e", "c", "a", "d", "b"];


	tpl = testTPL(
		"{{ var arr = data.array; arr.sort() }}",
		"{{ each(arr) }}",
			"{{= item }},",
		"{{ end }}"
	)({array: array});
	ok(expect == tpl, "whack each with default item var passed");


	tpl = testTPL(
		"{{ var arr = data.array; arr.sort() }}",
		"{{ each(arr, a) }}",
			"{{= a }},",
		"{{ end }}"
	)({array: array});
	ok(expect == tpl, "whack each with custom item var passed");



	tpl = testTPL(
		"{{ var arr = data.array; arr.sort() }}",
		"{{ for(var k = -1, len = arr.length; ++k < len; ) { }}",
			"{{= arr[k] }},",
		"{{ } }}"
	)({array: array});
	ok(expect == tpl, "js for passed");

});

