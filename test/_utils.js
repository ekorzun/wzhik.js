QUnit.done(function( details ) {
	var message = "Total: " + details.total + " Failed: " + details.failed + " Passed: " + details.passed + " Runtime: " + details.runtime;
	document.getElementById("done").innerHTML = message;
});


function testCompileAll( o ) {
	var fns = [
		Wzhik,
		 // WzhikNoExtends, WzhikSmallest, WzhikSmallestWith
	];
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