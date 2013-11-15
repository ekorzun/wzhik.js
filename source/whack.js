


// COMPILATION FLAGS
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var DEBUG = false;
/** @define {string} */		var WHACK_NAME = "Whack";
/** @define {boolean} */	var AUTOCOMPILE = true;
/** @define {boolean} */	var IGNORE_NULLS = true;



// SYNTAX OPTS
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var USE_WITH = false;
/** @define {string} */		var OPEN_TAG = "{{";
/** @define {string} */		var CLOSE_TAG = "}}";
/** @define {string} */		var OPERATOR_ECHO = "=";
/** @define {string} */		var OPERATOR_ESCAPED_ECHO = "-";
/** @define {string} */		var OPERATOR_COMMENT = "!";
/** @define {string} */		var OUTPUT_VAR = "_o";
/** @define {string} */		var INPUT_VAR = "_o";

// SUPPORT OPTS
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var SUPPORT_OLD_BROWSERS = true;
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
		KEY_ECHO = 5,
		KEY_ESCAPE = 6;

	// Cache indexes
	var _cacheCompiled = {},
		_cacheCompiledByTpl = {},
		_cachePartials = {},
		_cacheParsing = {},
		_cachePartialsIndex = {};



	// if( EXPERIMENTAL_HAS_BACKBONE ){
	// 	var regexBackbone = /(\w+)\.([\w_]+)(?!\(.*\))/g;
	// 	CODE_FIRST = "var "+OUTPUT_VAR+",_bb=data&&!!data.cid;"
	// } else {
	// 	CODE_FIRST = "var "+OUTPUT_VAR + ";";
	// }

	// It is possible to use Whack in underscore's style
	// E.g.  {a: 2} => a
	if( USE_WITH ) {
		var CODE_FIRST = 
			(IGNORE_NULLS ? "var _v=" + WHACK_NAME + ".v," : "var")
			+ OUTPUT_VAR + "=" + (DEBUG ? "[]" : "''")
			+ ";with("+INPUT_VAR+"){";
		var CODE_LAST  = "} return " + OUTPUT_VAR;
	} else {
		var CODE_FIRST = 
			(IGNORE_NULLS ? "var _v=" + WHACK_NAME + ".v," : "var")
			+ OUTPUT_VAR + "=" + (DEBUG ? "[]" : "''");
		var CODE_LAST  = "return " + OUTPUT_VAR;
	}

	if( DEBUG ) {
		CODE_FIRST = "try{" + CODE_FIRST;
		CODE_LAST = (USE_WITH ? "}" : "") + "}catch(e){console.error(e.message);};" + "return " + OUTPUT_VAR + (DEBUG ? ".join('')" : "");
	}




	if( SUPPORT_SHORTCODES ) {
		var parsemap = {

			"end" : function(){return {operator: KEY_JS, _code: '}'}},
			"else" : function(){return {operator: KEY_JS, _code: '}else{'}},
			"elseif" : function( code ){return parsemap["if"]("}else" + code)},

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
				// if( DEBUG ) {
				// 	console.log("Parsing <for>: ", code, vals);
				// }
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

			// if( DEBUG ) {
			// 	console.log("Parsing <block>", key, code);
			// }

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

	var isChrome = _window['chrome'];


	// http://kangax.github.io/es5-compat-table/#Object.keys
	// IE8- / FF3.6- / SF 4- / OP 11
	if(SUPPORT_OLD_BROWSERS && !Object.keys) {
		Object.keys = function( obj ){
			var keys = [];
			for(var k in obj) obj.hasOwnProperty(k) && keys.push(k);
			return keys;
		}
	}


 
	// http://jsperf.com/mega-trim-test
	if(SUPPORT_OLD_BROWSERS && !String.prototype.trim) {
		var whitespace = ' \n\r\t\v\f\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
		String.prototype.trim = function(){
			var s = isChrome ? this.match(/\S+(?:\s+\S+)*/) : this;
			
			if( isChrome )
				return s && s[0] || "";
			var i = 0, j = s.length-1;
	        
	        while(i < s.length && whitespace.indexOf(s.charAt(i)) > -1)
	                i++;
	        while(j > i && whitespace.indexOf(s.charAt(j)) > -1)
	                j--;

	        return s.substring(i, j+1);
		}
	}


	if( SUPPORT_FILTERS ) {

		var _filters = {},
			doc = _window.document;

		if( !isChrome ) {
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

		_filters["escapeHTML"] = function( code ) {
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
			var line = tokens[tokenIndex]
				//@todo Needs perf testing
				// May be problems with <pre />
				.replace(/\\/g,'\\\\')
				.replace(/\t+/g,'\t')
				.replace(/\n+/g,'\n')
				// .replace(/^\s{2,}/, '')
				.replace(/\n\t/, "")

			// Do not insert empty lines
			if( /^\s+$/.test(line)) continue;

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

					} else if( symbol === OPERATOR_ESCAPED_ECHO) {

						operator = OPERATOR_ECHO;
						code = WHACK_NAME + ".e" + "(" + code.substring(1) + ")";

					} else {

						if(symbol === OPERATOR_ECHO ) {
							code = code.substring(1);
						}

						if( SUPPORT_FILTERS && /\|(\w+)(?:\((.+)\))?\s*$/.test(code)){
							var f = _RegExp.$1, param = _RegExp.$2;
							if( buildTemplate['f'][f] ) {
								code = code.replace("|" + f + (param ? ("("+param+")") : ""), "");
								var __code = code;
								code = WHACK_NAME + ".f." + f + "(" + code + (param && "," + param) + ")";
							}
						}

						// @todo Backbone doesnt work with filters
						// if( EXPERIMENTAL_HAS_BACKBONE ) {
						// 	if( regexBackbone.test( code )) {
						// 		var m = _RegExp.$1, n = _RegExp.$2;
						// 		if( m && n ) {
						// 			code = "_bb&&"+m+".cid?" + m + ".get('" + n + "'):" + code;
						// 		}
						// 	}
						// }

						operator = OPERATOR_ECHO;
					}

					operator && (parsedLines[parsedLinesIndex++] = {
						operator : operator,
						_code : code
					});
				}
			}

		}

		if( SUPPORT_EXTENDS ) {
			if( !extended ) {
				parsedLines[parsedLinesIndex++] = {
					operator : KEY_JS,
					_code : CODE_LAST
				}
				parsedLines.len = parsedLinesIndex;
			} else {
				parsedLines.len = parsedLinesIndex;
			}
		} else {
			parsedLines[parsedLinesIndex++] = {
				operator : KEY_JS,
				_code : CODE_LAST
			}
			parsedLines.len = parsedLinesIndex;
		}

		// if( DEBUG ) {
		// 	console.log("Parsed lines: ", parsedLines)
		// }

		return (_cacheParsing[name] = parsedLines);
	}



	function compileTemplateString(str, name ){

		var parsedLines = parse(str, name);
		var parsedLinesIndex = parsedLines.len;
		var compiledLines = Array(parsedLinesIndex);
		var compiledLinesIndex = 0;
		var lastOperator,line, operator;

		for(var i = 0, l = parsedLinesIndex; i < l; i++ ){

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

					if ( DEBUG ) {
						var variable = v;
						var tplname = "'" + name + "'";
						var variableString = (line._code || "") + "";

						if(variableString.charAt(0) !== "'") {
							variableString = "'" + variableString.replace(/'/g,'\\\'').replace(/\n/g,'\\n') + "'"
						}

						v = "_v(" +[variable, variableString, tplname, compiledLinesIndex].join(",") + ")";
					} else {
						v = v.charAt(0) === "'" ? v : ("_v(" + v + ")");
					}

				}


				// http://jsperf.com/string-concat-vs-array-join-10000
				// In debug mode we are using [].push instead of concat
				// It's for easier debugging on dev enviroment because of formatted source
				if( DEBUG ) {
					
					compiledLines[compiledLinesIndex++] = OUTPUT_VAR + '.push(' + v + ');';

				} else {

					if(lastOperator !== OPERATOR_ECHO){
						if( IGNORE_NULLS ) {
							compiledLines[compiledLinesIndex++] = (OUTPUT_VAR + '+=') + v;
						} else {
							compiledLines[compiledLinesIndex++] = (OUTPUT_VAR + '+=') + '(' + v + ')';
						}
					} else {
						if( IGNORE_NULLS ) {
							compiledLines[compiledLinesIndex++] = '+' + v;
						} else {
							compiledLines[compiledLinesIndex++] = '+(' + v + ')';
						}
						
					}
				}
			}
			lastOperator = operator;
		}


		if( DEBUG ) {

			var compiled = compiledLines.join('');
			console.log("Compiled function: ", compiled);
			return compiled;

		} else {
			return compiledLines.join('');
		}
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

		// if(templateID && _cacheCompiled[templateID])
		// 	return _cacheCompiled[templateID];

		if(_cacheCompiledByTpl[templateString])
			return _cacheCompiledByTpl[templateString];

		if( DEBUG ) {
			console.group( "tpl: " + templateID );
		}

		var compiled = compileTemplateString(templateString, templateID);

		if( DEBUG ) {
			console.groupEnd("tpl: " + templateID);
		}

		var fn = new Function(INPUT_VAR, compiled);

		_cacheCompiledByTpl[templateString] = fn;

		if(templateID && !_cacheCompiled[templateID]){
			// _cacheCompiled[templateID] = fn;
			_cacheCompiled[templateID] = compiled;
		}

		return fn;
    }


    if( IGNORE_NULLS ) {
    	buildTemplate['v'] = function( o, variable, templateID, lineNumber ){
    		if( DEBUG ) {
    			try {
	    			if( o === undefined ) {
	    				console.warn("Undefined value: ", variable, '===', o, "in template", "#" +templateID, "at line", lineNumber);
	    			}
	    			return (typeof o === "number" || o) ? o : "";
	    		} catch(e) {

	    		}

    		} else {
    			return (typeof o === "number" || o) ? o : "";
    		}
    	}
    }

    if( SUPPORT_FILTERS ) {
    	buildTemplate['f'] = _filters;
    	buildTemplate['addFilter'] = function(name, fn){
    		_filters[name] = fn;
    		return buildTemplate
    	}
    }


    buildTemplate['e'] = function(code){
    	return buildTemplate['f']['escapeHTML']( code );
	}
	

    _window[WHACK_NAME] = buildTemplate;


    // For tests usage only
    _window[WHACK_NAME]['_name'] = WHACK_NAME;



    if( DEBUG ) {

		if(!_window['console']) {
			_window['console'] = {};
		}

		!_window['console']['log'] && (_window['console']['log']  = function(){})
		!_window['console']['group'] && (_window['console']['group']  = function(){})
		!_window['console']['groupEnd'] && (_window['console']['groupEnd']  = function(){})
		!_window['console']['warn'] && (_window['console']['warn']  = function(){})
		!_window['console']['error'] && (_window['console']['error'] = function(){})

    }

}( this );