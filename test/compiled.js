module("Compiled No Extends");

// test("sharedVars tpl", function(){
// 	var tpl = WzhikNoExtends(WzhikTemplate);
// 	var html = tpl(sharedVariables);
// 	$("#tester").html( html );
// 	ok(true);
// });



test("sharedVars tpl", function(){
	var tpl = WzhikSmallestWith(WzhikTemplateUnderscoreStyle);
	// var html = tpl(sharedVariables);
	// $("#tester").html( html );
	ok(true);
});



// test("sharedVars tpl", function(){
// 	var tpl = WzhikSmallest(WzhikTemplateUnderscoreStyleNoWith)
// 	var html = tpl(sharedVariables);
// 	$("#tester").html( html );
// 	ok(true);
// });

function each( object, fn ) {
	var length = object.length, i;
	if (typeof length === "number" && !isFunction( object ) ) {
		for ( i = 0; i < length && fn.call( object[ i ], i, object[ i ] ) !== false; i++ ) {}
	} else {
		for ( i in object ) {
			if ( fn.call( object[ i ], i, object[ i ] ) === false ) {
				break;
			}
		}
	}
}