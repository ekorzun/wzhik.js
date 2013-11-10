module("Advanced templates");


test("escapes and filters", function(){
	var expect, tpl;

	expect = "x";
	tpl = testTPL("{{ var x = '        x      '}}{{= x | trim}}")();
	ok(expect == tpl, "trim filter passed");


	expect = "10";
	tpl = testTPL("{{ var x =  -10 }}{{= x | abs}}")();
	ok(expect == tpl, "abs filter passed");


	expect = "Korzhik";
	tpl = testTPL("{{ var x =  'korzhik' }}{{= x | capitalize}}")();
	ok(expect == tpl, "capitalize filter passed");


	expect = "Korzhik";
	tpl = testTPL("{{ var x =  'korzhik' }}{{= x | capitalize}}")();
	ok(expect == tpl, "capitalize filter passed");


	expect = "&lt;img src=&#x27;xxx.jpg?a=1&amp;b=2&#x27; alt=&quot;title&quot; &#x2F;&gt;";
	tpl = testTPL2(
		"escapeHTML-tpl",
		"{{= data.str | escapeHTML}}"
	)({
		str : "<img src='xxx.jpg?a=1&b=2' alt=\"title\" />"
	});
	ok(expect == tpl, "escapeHTML filter passed");

});


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


test("Backbone models", function(){
	var expect, tpl;
	var Model = Backbone.Model.extend({
		age : function(){
			return (new Date).getFullYear() - this.get("year")
		}
	});

	var model = new Model({
		id : 32,
		year : 1990,
		name : "John"
	});


	expect = "John, " + ((new Date).getFullYear() - 1990);
	tpl = testTPL2(
		"Backbone-Test",
		"{{= data.name }}, {{= data.age()}}"
	)( model );
	ok( expect == tpl, "Backbone passed");
	
});







