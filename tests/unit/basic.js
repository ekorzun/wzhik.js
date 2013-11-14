// win xp 
// ie6 / ie7  не проходят 1 тест, предположительно из-за With

// win 7
// ie10 крашит, изза нефункциональности консоли (group / groupEnd)

// ff 3.0 - повел как ие6 себя http://take.ms/i3VtFe (нет trima)
// http://kangax.github.io/es5-compat-table/#String.prototype.trim

QUnit.done(function( details ) {
	var message = "Total: " + details.total + " Failed: " + details.failed + " Passed: " + details.passed + " Runtime: " + details.runtime;
	document.getElementById("done").innerHTML = message;
});


function testCompileAll( o ) {
	var fns = [Whack, WhackNoExtends, WhackSmallest, WhackSmallestWith];
	if( o.fns ) fns = o.fns;
	for (var i = fns.length - 1; i >= 0; i--) {
		var fn = fns[i], tplstr = o.tpl;
		var usewith = /with/i.test(fn._name);
		if( usewith ){
			tplstr = tplstr.replace(/data\.(\w+)/g, "$1");
		}
		var tpl = fn(tplstr);
		var res;
		if( usewith ) {
			res = tpl(o.data || {});
		} else {
			res = o.data ? tpl(o.data) : tpl();
		}
		(o.test || equal)(res, o.exp, fn._name + ": " + (o.msg || "ok"));
	};
}


test("Basics", function(){

	testCompileAll({
		tpl : "<div><p>Just some text. Hey, I know this is silly but it aids consistency.</p></div>",
		exp : "<div><p>Just some text. Hey, I know this is silly but it aids consistency.</p></div>",
		msg : "can interpolate nothing"
	});

	testCompileAll({
		data: {thing : 'This'},
		tpl : "{{= data.thing }} is gettin' on my noives!",
		exp : "This is gettin' on my noives!",
		msg : "can do basic attribute interpolation"
	});

	testCompileAll({
		tpl : "{{ var x = 2, y = x * 2, z = y * 3; }}{{= [x,y,z] }}",
		exp : "2,4,12",
		msg : "can do plain javascript expressions"
	});

	testCompileAll({
		tpl : "A {{ this;; }}{{ ; }} B",
		exp : "A  B",
		msg : "can interpolate semicolons / this"
	});

	// Falls in IE6/IE7 - probably beacuse of With
	testCompileAll({
		data: {a: -5},
		tpl : "{{ if(data.a > 5) { }}{{= 1 }}{{ } else if( data.a > 3 ){ }}{{= 2 }}{{ } else { }}{{= 3 }}{{ } }}",
		exp : "3",
		msg : "can do plain javascript if/else/endif (prefered underscore's tags)"
	});

	testCompileAll({
		data: {a: 15},
		tpl : "{{ if(data.a > 5) { }}{{= 1 }}{{ } else if( data.a > 3 ){ }}{{= 2 }}{{ } else { }}{{= 3 }}{{ } }}",
		exp : "1",
		msg : "can do plain javascript if/else/endif (prefered underscore's tags)"
	});


	testCompileAll({
		tpl : "It's its, not it's",
		exp : "It's its, not it's",
		msg : "can interpolate quotes"
	});

	testCompileAll({
		data: {foo: "bar"},
		tpl : "{{ if(data.foo == 'bar'){ }}Statement quotes and 'quotes'.{{ } }}",
		exp : "Statement quotes and 'quotes'.",
		msg : "quotes inside if"
	});


	testCompileAll({
		data: {thing: 'This'},
		tpl : "{{= data.thing }} is \\ridanculous",
		exp : "This is \\ridanculous",
		msg : "backslashes in text"
	});

	testCompileAll({
		data: {x: 'that'},
		tpl : "This\n\t\tis: {{= data.x }}.\n\tok.\nend.",
		exp : "This\n\t\tis: that.\n\tok.\nend.",
		msg : "newlines / tabs / spaces"
	});

});




test("Functions inside and return primitives", function(){
	
	var obj = {w: '', x: 'x', y: function(){ return this.x; }};

	testCompileAll({
		data: obj,
		tpl : "{{= data.w }}",
		exp : "",
		test: strictEqual
	});

	testCompileAll({
		data: obj,
		tpl : "{{= data.x }}",
		exp : "x",
		test: strictEqual
	});

	testCompileAll({
		data: obj,
		tpl : "{{= data.y() }}",
		exp : "x",
		test: strictEqual
	});

	testCompileAll({
		data: obj,
		tpl : "{{= data.z }}",
		exp : "",
		test: strictEqual,
		fns : [Whack, WhackNoExtends]
	});


	testCompileAll({
		data: {a: null, b: false, c: undefined},
		tpl : "{{= data.a }}{{= data.b }}{{= data.c }}",
		exp : "",
		test: strictEqual,
		msg : "false/null/undefined",
		fns : [WhackNoExtends, Whack]
	});

	// Тест не проходится без пробела в начале
	testCompileAll({
		data: {a: null, b: false, c: undefined},
		tpl : " {{= data.a }}{{= data.b }}{{= data.c }}",
		exp : " nullfalseundefined",
		test: strictEqual,
		msg : "false/null/undefined",
		fns : [WhackSmallest, WhackSmallestWith]
	});

});


test("Syntax", function(){

	var data = {
		arr : [1,2,3],
		arr2: [4,5,6]
	}

	testCompileAll({
		data: data,
		tpl : "{{ each(data.arr) }}{{= item }}{{ end }}",
		exp : "123",
		msg : "each auto var"
	});

	testCompileAll({
		data: data,
		tpl : "{{ each(data.arr, a) }}{{= a }}{{ end }}",
		exp : "123",
		msg : "each custom var"
	});

	testCompileAll({
		data: data,
		tpl : "{{ each(data.arr, a) { }}{{= a }}{{ end }}",
		exp : "123",
		msg : "each with bracket"
	});

	testCompileAll({
		data: data,
		tpl : "{{ each(data.arr, i) }}{{= i }}{{ each(data.arr2, j) }}{{= j }}{{ end }}{{ end }}",
		exp : "145624563456",
		msg : "each inside each"
	});

});


test('interpolate evaluates code only once.', function() {
	var count1 = 0;
	var count2 = 0;
	var count3 = 0;
	var count4 = 0;

	var tpl1 = Whack('{{= data.f()  }}');
	var tpl2 = WhackNoExtends('{{= data.f()  }}');
	var tpl3 = WhackSmallest('{{= data.f()  }}');
	var tpl4 = WhackSmallestWith('{{= data.f()  }}');

	tpl1({f: function(){ ok(!(count1++)); }});
	tpl2({f: function(){ ok(!(count2++)); }});
	tpl3({f: function(){ ok(!(count3++)); }});
	tpl4({f: function(){ ok(!(count4++)); }});
});
