
// http://kangax.github.io/es5-compat-table/#Object.keys
// IE8- / FF3.6- / SF 4- / Opera 11
if(SUPPORT_OLD_BROWSERS && !Object.keys) {
	Object.keys = function( obj ){
		var keys = [];
		for(var k in obj) {
			obj.hasOwnProperty(k) && keys.push(k);
		}
		return keys;
	}
}



// http://jsperf.com/mega-trim-test
if(SUPPORT_OLD_BROWSERS && !String.prototype.trim) {

	String.prototype.trim = function(){
	    for (var _char, ws = /32|10|13|9|12/, str = this, i = -1, j = str.length; ++i < j; ) {
	        _char = str.charCodeAt(i);
	        if (!ws.test(_char))  {
	        	for ( ; --j >= i; ) {
			        if (!ws.test(str.charCodeAt(j)))  {
			        	return str.substring(i, ++j);
			        }
			    }
	        }
	    }
	    return str.substring(i, ++j);
	}
}


