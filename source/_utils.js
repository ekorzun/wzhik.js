
if( SUPPORT_FILTERS ) {
	var isChrome = root['chrome'];
	var _filters = {}, doc = root.document;

	if( !isChrome && !server ) {
		var DOMtext 	= doc.createTextNode(""),
			DOMelement 	= doc.createElement("span");
		DOMelement.appendChild( DOMtext );
	}

	var
		amp = /&/g,
		q1 	= /"/g,
		q2	= /'/g,
		t1	= />/g,
		t2	= /</g,
		sl 	= /\//g;

	Wzhik['e'] = _filters["escape"] = function( code ) {
		return isChrome
			? code
				.replace(amp, '&amp;')
				.replace(t2, '&lt;')
				.replace(t1, '&gt;')
				.replace(q1, '&quot;')
				.replace(q2, '&#x27;')
				.replace(sl,'&#x2F;')
			: (DOMtext.nodeValue = code) && DOMelement.innerHTML;
	}

	Wzhik['f'] = _filters;
	Wzhik['addFilter'] = function(name, fn){
		_filters[name] = fn;
		return Wzhik
	}
}



if( IGNORE_NULLS ) {
	// Ignoring empty values
	// Example:
	// v(null) === ""
	// v(false) === ""
	// v(undefined) === ""
	// v(0) === 0
	Wzhik['v'] = function( value, templateID, lineNumber ){
		if( DEBUG ) {
			if( lineNumber ) {
				if( value === undefined ) {
    				console.warn(
    					"Undefined value: ",
    					variable, '===', value,
    					"in template", "#" +templateID,
    					"at line #", lineNumber, 
    					"(", (_cacheOriginals[templateID][originalLineNumber] || "").trim(), ")");
    			}
			}
		}
		return (typeof value === "number" || value) ? value : "";
	}
}




// @todo perf test: array detection vs 2 functions for object and array
// Each function
Wzhik["each"] = function(subject, fn){
	for(
		var index = -1,
			isarr = subject instanceof Array,
			arr = isarr ? subject : Object.keys( subject ),
			length = arr.length,
			value, key, r, last = length - 1;
		++index < length;
	) {
		if ( isarr ) {
			value = arr[index];
			key = index;
		} else {
			key = arr[index];
			value = subject[key];
		}

		if((r = fn( value,  key, index === 0, index === last, index % 2)) === false){
			return r
		};
	}
}