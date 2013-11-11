// http://jsperf.com/string-concat-vs-array-join-10000/8
// http://jsperf.com/advance-templates-benchmark/3
// http://jsperf.com/js-template-engines-performance/26


// COMPILATION FLAGS
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var DEBUG = true;
/** @define {string} */		var WHACK_NAME = "Whack";
/** @define {boolean} */	var AUTOCOMPILE = false;
/** @define {boolean} */	var EXTENDABLE_API = true;
/** @define {boolean} */	var IGNORE_NULLS = true;



// SYNTAX OPTS
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var USE_WITH = false;
/** @define {string} */		var OPEN_TAG = "{{";
/** @define {string} */		var CLOSE_TAG = "}}";
/** @define {string} */		var OPERATOR_ECHO = "=";
/** @define {string} */		var OPERATOR_ESCAPED_ECHO = "~";
/** @define {string} */		var OPERATOR_COMMENT = "!";
/** @define {string} */		var OUTPUT_VAR = "_o";

// SUPPORT OPTS
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var SUPPORT_OLD_BROWSERS = false;
/** @define {boolean} */	var SUPPORT_SHORTCODES = true;
/** @define {boolean} */	var SUPPORT_EXTENDS = true;
/** @define {boolean} */	var SUPPORT_PARTIALS = true;
/** @define {boolean} */	var SUPPORT_FILTERS = true;

// EXPERIMENTAL OPTS
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var EXPERIMENTAL_HAS_JQUERY = false;
/** @define {boolean} */	var EXPERIMENTAL_HAS_BACKBONE = false;



+function(_window){


	var tplHash = 0;

	// regexp.test is the fastest way
	// E.g. var x = /(\w+)/.test( string ) && RegExp.$1
	// http://jsperf.com/js-exec-vs-match/2
	var _RegExp = _window['RegExp'];

	// Operators codes
	var KEY_JS = 1,
		KEY_FOR = 2,
		KEY_BLOCK = 3,
		KEY_FILTER = 4,
		KEY_ECHO = 5;

	// Cache indexes
	var _cacheCompiled = {},
		_cacheCompiledByTpl = {},
		_cachePartials = {},
		_cacheParsing = {},
		_cachePartialsIndex = {};

	// Code defaults
	var CODE_FIRST, CODE_LAST;


	if( EXPERIMENTAL_HAS_BACKBONE ){
		var regexBackbone = /(\w+)\.([\w_]+)(?!\(.*\))/g;
		CODE_FIRST = "var "+OUTPUT_VAR+",_bb=data&&!!data.cid;"
	} else {
		CODE_FIRST = "var "+OUTPUT_VAR + ";";

	}


	// It is possible to use Whack in underscore's style
	// E.g.  {a: 2} => a
	if( USE_WITH ) {
		CODE_FIRST = CODE_FIRST + "with(data){";
		var CODE_LAST  = "}return " + OUTPUT_VAR;
	} else {
		var CODE_LAST  = "return " + OUTPUT_VAR;
	}



	if( SUPPORT_SHORTCODES ) {
		var parsemap = {

			"end" : function(){return {operator: KEY_JS, _code: '}'}},
			"else" : function(){return {operator: KEY_JS, _code: '} else {'}},
			"elseif" : function( code ){return parsemap["if"]("} else " + code)},

			"if" : function(code){
				var p = code.lastIndexOf(':');
				var notTernearyExp = code.split(':').slice(-1)[0].trim()==='';
				if( p >-1 && notTernearyExp){
					code = code.substr(0, p) + '{';
				} else if( p === -1 ){
					if(code.split(')').slice(-1)[0].trim()==='') code+= '{';
				}
				return {
					operator : KEY_JS,
					_code : code
				};
			},
			"each" : function(code){
				var vals = regexFOR.test(code) && _RegExp;
				if( DEBUG ) {
					console.log("Parsing <for>: ", code, vals);
				}
				return {
					operator : KEY_FOR,
					_code : [vals.$1, vals.$2]
				}
			}
		}
	} else {
		var parsemap = {};
	}


	if( SUPPORT_PARTIALS ) {
		parsemap["include"] = function(code) {
			var r = regexOP.test(code) && _RegExp.$1;

			if(AUTOCOMPILE && !_cacheCompiled[r]){
				buildTemplate(r);
				_cachePartials[r] = _cacheCompiled[r].replace(CODE_FIRST, "").replace(CODE_LAST, "")
				if(DEBUG && !_cachePartials[r]) {
					console.error("Autocompilation for", r, "failed");
				}
			}

			if( DEBUG ) {
				if( !_cacheCompiled[r] ) {
					console.error("There is no compiled template named " + r);
					return {
						operator : KEY_JS,
						_code : ";"
					};
				}
			}
			return {
				operator : KEY_JS,
				_code : _cachePartials[r] || (_cachePartials[r] = _cacheCompiled[r].replace(CODE_FIRST, "").replace(CODE_LAST, ""))
			}
		}
	}


	if( SUPPORT_EXTENDS ) {

		parsemap["block"] = function( code, name )  {
			var blockname = regexOP.test(code) && _RegExp.$1,
				key = name + ":" + blockname

			if( DEBUG ) {
				console.log("Parsing <block>", key, code);
			}

			return {
				operator : KEY_BLOCK,
				_code : key
			}
		}


		parsemap["endblock"] = function( code, name, blockname ) {
			return {
				operator : OPERATOR_ECHO,
				_code: "''"
			}
		}

	}



	if(SUPPORT_OLD_BROWSERS && !Object.keys) {
		Object.keys = function( obj ){
			var keys = [];
			for(var k in obj) obj.hasOwnProperty(k) && keys.push(k);
			return keys;
		}
	}


	if(SUPPORT_FILTERS) {

		var _filters = {},
			isChrome = _window['chrome'],
			doc = _window.document;

		if( isChrome ) {
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

		_filters["escapeHTML"] = function( code, name ) {
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

	}


	// Precompiled regex
	// http://jsperf.com/regexp-test-search-vs-indexof/27
	var regexFOR	= /\(([\w\.\_]+),?\s*(\w+)?\)/,
		regexOP		= /([\w\-#_]+)\s?$/,
		regexEXTEND	= /extends\s+([\w\-_#]+)/,
		regexPARSE 	= new _RegExp("^\\s*(" + Object.keys(parsemap).join("|") + ")\\b");


	//
	//
	//
	function parse( templateString, name){

		var parsedLinesIndex;
		var parsedLines;
		var tokens = templateString.split( CLOSE_TAG );

		var extended;
		var parentID;

		// If Whack supports extend, it should be in the first line
		if( SUPPORT_EXTENDS && (parentID = regexEXTEND.test(tokens[0]) && _RegExp.$1)) {

			// In autocompile mode make sure that parentID is exist
			if(AUTOCOMPILE && !_cacheParsing[parentID]){
				// Try to compile parent from DOM useing ID selector
				buildTemplate( parentID );
				if(DEBUG && !_cacheParsing[parentID]) {
					console.error("Autocompilation for", parentID, "failed");
				}
			}

			// Also compile may fails if autocompile opt isnt active
			if( DEBUG ) {
				if( !_cacheParsing[parentID] ) {
					console.error("There is no compiled template named " + parentID);
					console.info("To prevent this error, please use autocompile flag or precompiled templates");
					return false;
				}
			}

			// Everything is fine
			_cacheParsing[name] = _cacheParsing[parentID];
			parsedLines = _cacheParsing[name];
			parsedLinesIndex = parsedLines.len;

			// Remove first line with extend call
			// and mark current template as extended
			tokens.shift();
			extended = 1;

			if( DEBUG ) {
				console.log("Extending: ", name, 'extends', parentID);
			}
		} else {

			// Whack doesnt support extending, so we use default code
			parsedLinesIndex = 1;
			parsedLines = {
				0 : {
					operator: KEY_JS,
					_code : CODE_FIRST
				}
			}
		}

		// Start parsing tokens
		for(var tokenIndex = 0, tokensLength = tokens.length; tokenIndex < tokensLength; tokenIndex++){

			// Make sure that code doesnt contains slashes
			var line = tokens[tokenIndex].replace(/\\/g,'\\\\');
			var l = line.split( OPEN_TAG );

			// Code may start with plain text
			if( l[0] !== ''){
				parsedLines[parsedLinesIndex++] = {
					operator: OPERATOR_ECHO,
					_code :'\''+l[0].replace(/'/g,'\\\'').replace(/\n/g,'\\n')+'\''
				};
			}

			var code = l[1];
			if( code ){

				// Check any custom operator (include / for / if  etc)
				var operator = regexPARSE.test(code) && _RegExp.$1;
				if( operator ) {

					// Execute it
					code = parsemap[operator]( code, name );

					// It was the first line with Block statement
					// So we need to compile sub-template from this block
					// @todo add multilevel blocks
					if( SUPPORT_EXTENDS && code && code.operator === KEY_BLOCK ) {

						// Ignore current line, because it contains only block definition
						// So we take the next
						var tempLine = tokens[++tokenIndex];
						var partial = [tempLine];

						// Current template + block cache key
						var key = code._code;

						// End of block state
						var endblock = 0;

						// block may contains only one line/word
						if(tempLine.indexOf("endblock") < 0) {

							// Push partial until block will end
							while( !endblock && (tempLine = tokens[++tokenIndex]) !== undefined ) {
								if(tempLine.indexOf("endblock") > -1) {
									endblock = 1;
									partial.push(tempLine.split(CLOSE_TAG)[0]);
								} else {
									partial.push(tempLine);
								}
							}
						}

						partial = partial.join( CLOSE_TAG ) // + CLOSE_TAG
						;

						// Compile block as subtemplate and store it
						var render = compileTemplateString(partial, key, true).replace(CODE_FIRST, "").replace(CODE_LAST,"");
						_cachePartials[key] = render;
						_cachePartialsIndex[key] = parsedLinesIndex;

						// If current template is extended from another
						// rewrite block cache
						if( extended ){

							parsedLines[_cachePartialsIndex[key.replace(name,parentID)]] = {
								operator : KEY_BLOCK,
								_code :  key
							}

						} else {

							// Otherwise
							parsedLines[parsedLinesIndex++] = {
								operator : KEY_BLOCK,
								_code :  key
							};
						}

					} else {
						parsedLines[parsedLinesIndex++] = code;
					}


				} else {

					var symbol = code.charAt(0);
					var operator;

					if(symbol === ' '){
						operator = KEY_JS;

					} else if(symbol === OPERATOR_COMMENT){ // comments

						continue;

					} else {

						if(symbol === OPERATOR_ECHO ) {
							code = code.substring(1);
						}

						if( SUPPORT_FILTERS && /\|\s(\w+)/.test(code)){
							var f = _RegExp.$1;
							code = code.replace("| " + f, "");
							var __code = code;
							code = WHACK_NAME + ".f." + f + "(" + code + ")";
						}

						// @todo Backbone doesnt work with filters
						if( EXPERIMENTAL_HAS_BACKBONE ) {
							if( regexBackbone.test( code )) {
								var m = _RegExp.$1, n = _RegExp.$2;
								if( m && n ) {
									code = "_bb&&"+m+".cid?" + m + ".get('" + n + "'):" + code;
								}
							}
						}

						operator = OPERATOR_ECHO;
					}

					operator && (parsedLines[parsedLinesIndex++] = {
						operator : operator,
						_code : code
					});
				}
			}

		}

		if( SUPPORT_EXTENDS && !extended ) {
			parsedLines[parsedLinesIndex++] = {
				operator : KEY_JS,
				_code : CODE_LAST
			}
			parsedLines.len = parsedLinesIndex;
		}

		if( DEBUG ) {
			console.log("Parsed lines: ", parsedLines)
		}

		return (_cacheParsing[name] = parsedLines);
	}



	function compileTemplateString(str, name ){

		var parsedLines = parse(str, name);
		var parsedLinesIndex = parsedLines.len;
		var compiledLines = Array(parsedLinesIndex);
		var compiledLinesIndex = 0;
		var lastOperator,line, operator;

		for(var i=0,l=parsedLinesIndex;i<l;i++){

			line = parsedLines[i];
			operator = line.operator;

			if( lastOperator !== operator || operator === KEY_JS)
				compiledLines[compiledLinesIndex++] = ';';

			var v = line._code;

			if(operator === KEY_JS){

				compiledLines[compiledLinesIndex++] = v;

			} else if(operator === KEY_FOR){

				var item = v[1] || "item",
					iter = "i" + tplHash,
					len  = "l" + tplHash,
					arr  = "a" + tplHash;

				tplHash++;

				compiledLines[compiledLinesIndex++] = (
					'for(var '+ iter + '=0,' + item + ',' + arr + '=' + v[0] + ',' + len + '=' + arr + '.length;' +
						iter + '<' + len + ';' + iter + '++){' + item + '=' + arr + '[' + iter + ']'
				);

			} else if( SUPPORT_EXTENDS && operator === KEY_BLOCK ){

				compiledLines[compiledLinesIndex++] = _cachePartials[v];

			} else {

				if( IGNORE_NULLS ) {
					v = WHACK_NAME + ".v("+v+")";
				}

				if(lastOperator !== OPERATOR_ECHO){
					compiledLines[compiledLinesIndex++] = (OUTPUT_VAR + '+=') + '(' + v + ')';
				} else {
					compiledLines[compiledLinesIndex++] = '+(' + v + ')'
				}
			}
			lastOperator = operator;
		}

		return compiledLines.join('');
	}




	//
	//
	//
	function buildTemplate(templateString, templateID){



		if(templateString.charAt(0) === "#"){
			templateID = templateString;
			if( EXPERIMENTAL_HAS_JQUERY) {
				templateString = $(templateString).html();
			} else {
				templateString = document.getElementById(templateString.substr(1)).innerHTML;
			}
		}

		!templateID && (templateID = "t" + tplHash++);

		if( DEBUG ) {
			console.group( "tpl: " + templateID );
		}

		// if(templateID && _cacheCompiled[templateID])
		// 	return _cacheCompiled[templateID];

		if(_cacheCompiledByTpl[templateString])
			return _cacheCompiledByTpl[templateString];

		var compiled = compileTemplateString(templateString, templateID);

		if( DEBUG ) {
			console.log("Compiled function: ", compiled);
			console.groupEnd("tpl: " + templateID);
		}

		var fn = new Function('data', compiled);

		_cacheCompiledByTpl[templateString] = fn;

		if(templateID && !_cacheCompiled[templateID]){
			// _cacheCompiled[templateID] = fn;
			_cacheCompiled[templateID] = compiled;
		}

		return fn;
    }

    if( IGNORE_NULLS || EXPERIMENTAL_HAS_BACKBONE ) {
    	buildTemplate['v'] = function( o ){
    		if( typeof o === "number" ) return o;
    		if(!o) return "";
    		return o;
    	}
    }

    if(SUPPORT_FILTERS) {
    	buildTemplate['f'] = _filters;
    }


<<<<<<< HEAD
    if(EXTENDABLE_API) {
    	if( SUPPORT_FILTERS ) {
	    	buildTemplate['addFilter'] = function(name, fn){
	    		_filters[name] = fn;
	    	}
	    }
    }

    
=======
>>>>>>> 82cd7495d0507e159139d1870da7d243e6ea1b52

    _window[WHACK_NAME] = buildTemplate;

}( this );
