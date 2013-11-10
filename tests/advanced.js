module("Advanced templates");


// test("escapes and filters", function(){
// 	var expect, tpl;

// 	ok(true, ":D")
// });


test("partials", function(){
	var expect, tpl, tpl2

	expect = "Hi, john<br />Hi, jack<br />Hi, whack<br />";
	tpl = testTPL2("hitpl","Hi, {{= name }}<br />");
	tpl2 = testTPL(
		"{{ var names = ['john', 'jack', 'whack'] }}",
		"{{ each(names, name) }}",
			"{{ include hitpl }}",
		"{{ end }}"
	)();
	ok(expect == tpl2, "include in context passed");

});



test("extends", function(){
	var expect, tpl, tpl2, expect2;

	expect = "Parent Header (i am parent) Parent footer";
	expect2 = "Parent Header (i am child) Parent footer";

	tpl = testTPL2(
		"parenttpl1",
		"Parent Header (",
		"{{ block content }}",
			"i am parent",
		"{{ endblock }}",
		") Parent footer"
	)();

	ok( expect === tpl, "parent tpl passed" );

	tpl2 = testTPL2(
		"childtpl1",
		"{{ extends parenttpl1 }}",
		"{{ block content }}",
			"i am child",
		"{{ endblock }}"
	)();

	ok(expect2 == tpl2, "child tpl passed");
	ok(expect === tpl, "parent tpl not corrupted passed" );

});


// test("escaping strings", function(){

// });