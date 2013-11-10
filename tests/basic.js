
module("Simple templates");

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



})

