module("Simple templates");


test("underscore pizding tests", function(){

    // var escapeTemplate = testTPL('{{~ data.a ? "checked=\\"checked\\"" : "" }}');
    // equal(escapeTemplate({a: true}), 'checked="checked"', 'can handle slash escapes in interpolations.');


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




    // @todo move escape to "-" operator
    var template = testTPL("<i>{{= data.value | escapeHTML }}</i>");
    var result = template({value: "<script>"});
    equal(result, '<i>&lt;script&gt;</i>');


    var stooge = {
      name: "Moe",
      template: testTPL("I'm {{= this.name }}")
    };
    equal(stooge.template(), "I'm Moe");

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


test( "if/else", function() {
	var tpl, expect;

	expect = "50";
	tpl = testTPL(
		"{{ if( data.i > 5) }}",
			"{{= data.i * 5 }}",
		"{{ end }}"
	)({i : 10});
	ok(expect == tpl, "wzhik if passed");


	expect = "10";
	tpl = testTPL(
		"{{ if( data.i > 50) }}",
			"{{= data.i * 5 }}",
		"{{ else }}",
			"{{= data.i }}",
		"{{ end }}"
	)({i : 10});
	ok(expect == tpl, "wzhik if/else passed");


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
	ok(expect == tpl, "wzhik each with default item var passed");


	tpl = testTPL(
		"{{ var arr = data.array; arr.sort() }}",
		"{{ each(arr, a) }}",
			"{{= a }},",
		"{{ end }}"
	)({array: array});
	ok(expect == tpl, "wzhik each with custom item var passed");



	tpl = testTPL(
		"{{ var arr = data.array; arr.sort() }}",
		"{{ for(var k = -1, len = arr.length; ++k < len; ) { }}",
			"{{= arr[k] }},",
		"{{ } }}"
	)({array: array});
	ok(expect == tpl, "js for passed");

});

