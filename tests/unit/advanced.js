module("Advanced");

test("Partials / Extends / Compile on the go", function(){

	var expect, tpl, tpl2

	expect = "Hi, john<br />Hi, jack<br />Hi, whack<br />";
	var tplstr = "Hi, {{= name }}<br />";
	var tplstr2= "{{ var names = ['john', 'jack', 'whack'] }}{{ each(names, name) }}{{ include hitpl }}{{ end }}";
	var tplWhack = Whack(tplstr, "hitpl");
	var tplWhackNoExtends = WhackNoExtends(tplstr, "hitpl");

	equal( Whack(tplstr2)(), expect, "include in each passed");
	equal( WhackNoExtends(tplstr2)(), expect, "include in each passed");

});