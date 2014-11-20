


// COMPILATION FLAGS
// ------------------------------------------------------------------------------------------------

// Debug information
// error detection
// formatted template sources etc.
/** @define {boolean} */	var DEBUG = true;

// Global variable name
/** @define {string} */		var WZHIK_NAME = "Wzhik";

// 
/** @define {boolean} */	var AUTOCOMPILE = true;

// 
/** @define {boolean} */	var IGNORE_NULLS = true;


// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ****************************************** NERD MODE *******************************************
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------


// SYNTAX OPTS
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var USE_WITH = false;
/** @define {string} */		var OPEN_TAG = "{{";
/** @define {string} */		var CLOSE_TAG = "}}";
/** @define {string} */		var OPERATOR_ECHO = "=";
/** @define {string} */		var OPERATOR_ESCAPED_ECHO = "-";
/** @define {string} */		var OPERATOR_COMMENT = "#";
/** @define {string} */		var OPERATOR_FILTER = "|";
/** @define {string} */		var OUTPUT_VAR = "_o";
/** @define {string} */		var INPUT_VAR = "data";

// SUPPORT OPTS
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var SUPPORT_OLD_BROWSERS = false;
/** @define {boolean} */	var SUPPORT_SHORTCODES = true;
/** @define {boolean} */	var SUPPORT_EXTENDS = true;
/** @define {boolean} */	var SUPPORT_PARTIALS = true;
/** @define {boolean} */	var SUPPORT_FILTERS = true;

// 
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var SUPPORT_EXPERIMENTAL = false;


+function(root){

	var server = (typeof exports !== 'undefined');

	// Simple increment ID for for tpl/patrial etc.
	var UID = 0;

	if( DEBUG ) {
		var TUID = 0;
	}

	// regexp.test is the fastest way
	// E.g. var x = /(\w+)/.test( string ) && RegExp.$1
	// http://jsperf.com/js-exec-vs-match/2
	var _RegExp = server ? RegExp : root['RegExp'];

	// Operators codes
	var KEY_JS = 1,
		KEY_FOR = 2,
		KEY_BLOCK = 3,
		KEY_FILTER = 4,
		KEY_ECHO = 5,
		KEY_ESCAPE = 6;

	// Cache indexes
	var 
		_cacheCompiled = {},
		_cacheCompiledByTpl = {},
		_cachePartials = {},
		_cacheParsing = {},
		_cachePartialsIndex = {};

	// First and last lines of compiled tpl
	var 
		CODE_FIRST, 
		CODE_LAST = "return " + OUTPUT_VAR;


	// It is possible to use Wzhik in Underscore's style
	// E.g.  {someProp: 2} => someProp
	// It is not recommended to use this setting
	// http://www.2ality.com/2011/06/with-statement.html
	if( USE_WITH ) {

		// @todo Try to replace "With" with real(?) local vars
		CODE_FIRST = 
			(IGNORE_NULLS ? "var _v=" + WZHIK_NAME + ".v," : "var")
			+ OUTPUT_VAR + "=" + (DEBUG ? "[]" : "''")
			+ ";with(" + INPUT_VAR + "){";

		CODE_LAST  = "} " + CODE_LAST;

	} else {

		CODE_FIRST = 
			(IGNORE_NULLS ? "var _v=" + WZHIK_NAME + ".v," : "var")
			+ OUTPUT_VAR + "=" + (DEBUG ? "[]" : "''");
	}


	// 
	if( DEBUG ) {
		// CODE_FIRST = "try{" + CODE_FIRST;
		// CODE_LAST = (USE_WITH ? "}" : "") + "}catch(e){console.error(e.message);};" + "return " + OUTPUT_VAR + (DEBUG ? ".join('')" : "");
		CODE_FIRST += ",_d=" + WZHIK_NAME + ".debug";
		CODE_LAST = (USE_WITH ? "}" : "") + "return " + OUTPUT_VAR + (DEBUG ? ".join('')" : "");
	}



	
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
	
	//
	//
	function parseTemplateString( templateString, name){
	
		var parsedLinesIndex;
		var parsedLines;
		var tokens = templateString.split( CLOSE_TAG );
	
		if( DEBUG ) {
			// normalize string to get line numbers
			var originalLineIndex = 0;
			var originalLines  = templateString.split(/\n/);
			var originalLinesCount = originalLines.length;
			_cacheOriginals[name] = originalLines;
	
			if(!_cacheParsingDebug[name]) {
				_cacheParsingDebug[name] = [];
			}
		}
	
		// @todo debug real unclosed tags
		// if ( DEBUG && tokens.length != templateString.split( OPEN_TAG ) ) {
		// 	console.error( "Somewhere over the rainbow" )
		// }
	
		var extended;
		var parentID;
	
		// If Wzhik supports extend, it should be in the first line
		if( SUPPORT_EXTENDS && (parentID = regexEXTEND.test(tokens[0]) && _RegExp.$1)) {
	
			// In autocompile mode make sure that parentID is exist
			if(AUTOCOMPILE && !_cacheParsing[parentID]){
				// Try to compile parent from DOM useing ID selector
				Wzhik( parentID );
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
	
			// Wzhik doesnt support extending, so we use default code
			parsedLinesIndex = 1;
	
			// if( DEBUG ) {
				
			// 	parsedLines = {
			// 		0 : {
			// 			operator: KEY_JS,
			// 			_code : CODE_FIRST 
			// 		}
			// 	}
			// } else {
				parsedLines = {
					0 : {
						operator: KEY_JS,
						_code : CODE_FIRST
					}
				}
			// }
		}
	
		// console.log( tokens )
	
		// Start parsing tokens
		for(var tokenIndex = 0, tokensLength = tokens.length; tokenIndex < tokensLength; tokenIndex++){
	
	
	
			// Make sure that code doesnt contains slashes
			var line = tokens[tokenIndex]
				//@todo Needs perf testing
				// May be problems with <pre />
				.replace(/\\/g,'\\\\')
				.replace(/\t+/g,'\t')
				.replace(/\n+/g,'\n')
				.replace(/\n\t/, "");
	
			if( DEBUG ) {
				var debugline = tokens[tokenIndex].split(/\n/);
				if( debugline.length > 1 ) {
					debugline.forEach(function(ln){
						// console.log({
						// 	ln : ln,
						// 	orig : getOriginalLine(ln, name), 
						// 	line : line,
						// 	parse :parsedLinesIndex
						// });
					
						_cacheParsingDebug[name].push({parsed :parsedLinesIndex, original:  getOriginalLine(ln, name)});
					});
				} else {
					_cacheParsingDebug[name].push({parsed :parsedLinesIndex, original:  getOriginalLine(debugline, name)});
					// _cacheParsingDebug[name].push(line);
				}
			}
	
			
			// Do not insert empty lines
			if( /^\s+$/.test(line)) continue;
	
			var l = line.split( OPEN_TAG );
	
			// Code may start with plain text
			if( l[0] !== ''){
				
				if( DEBUG ) {
					_cacheParsingDebug[name].push({parsed :parsedLinesIndex, original:  getOriginalLine(l[0], name)});
				}
	
				parsedLines[parsedLinesIndex++] = {
					operator: OPERATOR_ECHO,
					_code :'\''+l[0].replace(/'/g,'\\\'').replace(/\n/g,'\\n')+'\''
				};
			}
	
			var code = l[1];
	
			if( DEBUG ) {
				_cacheParsingDebug[name].push({parsed :parsedLinesIndex, original:  getOriginalLine(l[1], name)});
			}
	
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
						
						// if( DEBUG ) {
						// 	+ ",_t='" + name + "'"
						// }
	
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
						code = WZHIK_NAME + ".e" + "(" + code.substring(1) + ")";
	
					} else {
	
						if(symbol === OPERATOR_ECHO ) {
							code = code.substring(1);
						}
	
						if( SUPPORT_FILTERS && /\|(\w+)(?:\((.+)\))?\s*$/.test(code)){
							var f = _RegExp.$1, param = _RegExp.$2;
							if( Wzhik['f'][f] ) {
								code = code.replace("|" + f + (param ? ("("+param+")") : ""), "");
								// var __code = code;
								code = WZHIK_NAME + ".f." + f + "(" + code + (param && "," + param) + ")";
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
	
	
	if( DEBUG ) {
		Wzhik.parseTemplateString = parseTemplateString;
	}
	
	
	
	var parsemap = {};
	
	if( SUPPORT_SHORTCODES ) {
	
		parsemap = {
	
			"end" : function(){
				return {operator: KEY_JS, _code: '}'}
			},
	
			"endeach" : function(){
				return {operator: KEY_JS, _code: '})'}
			},
	
			"else" : function(){
				return {operator: KEY_JS, _code: '}else{'}
			},
	
			"elseif" : function( code ){
				return parsemap["if"]("}else " + code.replace("else", ""))
			},
	
			"if" : function(code){
	
				if( code.indexOf("{") < 0 ) {
					code += "{";
				}
				return {
					operator : KEY_JS,
					_code : code
				};
			},
	
			"each" : function(code){
				// var vals = regexFOR.test(code) && _RegExp;
				// console.info(regexFOR.test(code), code , [vals.$1, vals.$2]);
				return {
					operator : KEY_FOR,
					_code : regexFOR.test(code) && _RegExp.$1.split(",")
					// vals.$1
				}
			}
		}
	
		// alias
		parsemap["forEach"] = parsemap["each"];
	}
	
	
	
	if( SUPPORT_PARTIALS ) {
	
		// function wrapCode( code ) {
		// 	return CODE_FIRST + code + CODE_LAST
		// }
	
		parsemap["include"] = function(code) {
	
			var r = regexOP.test(code) && _RegExp.$1;
	
			if(AUTOCOMPILE && !_cacheCompiled[r]){
	
				Wzhik(r);
	
				_cachePartials[r] = _cacheCompiled[r].replace(CODE_FIRST, "").replace(CODE_LAST, "");
	
				if(DEBUG && !_cachePartials[r]) {
					console.error("Autocompilation for", r, "failed");
				}
			}
			
	
			if( DEBUG && !_cacheCompiled[r]  ) {
				console.error("There is no compiled template named " + r);
				return {
					operator : KEY_JS,
					_code : ";"
				};
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
	
	
	
	
	
	// Precompiled regex
	// http://jsperf.com/regexp-test-search-vs-indexof/27
	var regexFOR	= /\(\s?([\w\.\_\,\s]+)\)/,
		regexOP		= /([\w\-#_]+)\s?$/,
		regexEXTEND	= /extends\s+([\w\-_#]+)/,
		regexPARSE 	= new _RegExp("^\\s*(" + Object.keys(parsemap).join("|") + ")\\b");
	
	
	function compileTemplateString(str, name, isPartial ){
	
		var parsedLines = parseTemplateString(str, name);
		var parsedLinesIndex = parsedLines.len;
		var compiledLines = Array(parsedLinesIndex);
		var compiledLinesIndex = 0;
		var lastOperator,line, operator;
	
		// console.log(_cacheParsingDebug[name], parsedLinesIndex )
	
		for(var i = -1, l = parsedLinesIndex; ++i < l;){
	
			line = parsedLines[i];
			operator = line.operator;
	
			if( lastOperator !== operator || operator === KEY_JS)
				compiledLines[compiledLinesIndex++] = ';';
	
			var v = line._code;
	
			// Plain javascript
			if(operator === KEY_JS){
	
				compiledLines[compiledLinesIndex++] = v;
	
			// Each / forfor
			} else if(operator === KEY_FOR){
	
				var item = v[1] || "item",
					iter = v[2] || "i" + UID,
					len  = "l" + UID,
					arr  = "a" + UID;
	
				UID++;
	
				// 
				// compiledLines[compiledLinesIndex++] = OUTPUT_VAR + '.push(' + '"<!--' + v[0] + '-->");';
				compiledLines[compiledLinesIndex++] = (
					"var " + arr + "=" + v[0] +
					";Wzhik.each(" + arr + ",function(" + item + "," + iter + "," + item + "_isFirst," + item + "_isLast," + item + "_isEven" + "){"
					// var a1 = data.array,
					// "var " + arr + "=" + v[0] + 
					// ";for(var " + iter + "=0," + item + "," + len + "=" + arr + ".length;" +
					// 	iter + "<" + len + ";" + iter + "++){" + item + "=" + arr + "[" + iter + "];" + 
					// 	"var " + item + "_isFirst=(" + iter + "==0)," + 
					// 			 item + "_isLast=(" + iter + "=="+len+"-1)," + 
					// 			 item + "_isEven=(" + iter + "%2)"
				);
	
			// Block operator
			} else if( SUPPORT_EXTENDS && operator === KEY_BLOCK ){
	
				compiledLines[compiledLinesIndex++] = _cachePartials[v];
	
			} else {
	
				if( DEBUG ) {
					var origline = getOriginalLineFromParsedIndex(i, name);
					if( origline ) {
						compiledLines[compiledLinesIndex++] = "try{";
					}
				}
	
				if( IGNORE_NULLS ) {
	
					if ( DEBUG ) {
						var variable = v;
	
						if( SUPPORT_EXPERIMENTAL && v.charAt(0) !== "'" ) {
							// @todo ?
							v = v.trim();
							var variableComment = '"<!--' + v + '-->"';
							variable = variableComment + "+" + v;
						}
	
						var variableString = (line._code || "");
	
						if(variableString.charAt(0) !== "'") {
							variableString = "'" + variableString.replace(/'/g,'\\\'').replace(/\n/g,'\\n').trim() + "'"
						}
	
						v = "_v(" + [variable, "_t" + TUID] + (origline ? "," + origline : "") + ")";
	
					} else {
						v = v.charAt(0) === "'" ? v : ("_v(" + v + ")");
					}
	
				}
	
	
				// http://jsperf.com/string-concat-vs-array-join-10000
				// In debug mode we are using [].push instead of concat
				// It's for easier debugging on dev enviroment because of formatted source
				if( DEBUG ) {
	
					// console.log({
					// 	parsed: i,
					// 	orig : getOriginalLineFromParsedIndex(i, name), 
					// 	v : v
					// });
					
					compiledLines[compiledLinesIndex++] = OUTPUT_VAR + '.push(' + v + ');';
					if( origline ) {
						compiledLines[compiledLinesIndex++] = [
							"}catch(e){",
								origline ? ("_d(_t"+TUID+"," + origline + ",e);") : "",
							"}"
						].join("");
					}
	
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
			compiledLines.unshift("var _t"+(TUID++)+"='"+name+"';");
	
			var compiled = compiledLines.join('\n');
	
			try {
				console.log("Compiled function: ", js_beautify(compiled));
			} catch(e) {
				console.log("Compiled function: ", compiled);
			}
	
			return compiled;
	
		} else {
			return compiledLines.join('');
		}
	}
	

	//
	//
	//
	function Wzhik(templateString, templateID, isPartial ){

		if(templateString.charAt(0) === "#"){
			templateID = templateString;
			if( DEBUG ) {
				var element = document.getElementById(templateString.substr(1));
				if( !element ) {
					console.error("The is no element with ID ", templateString);
				}

				templateString = element.innerHTML;

			} else {
				templateString = document.getElementById(templateString.substr(1)).innerHTML;
			}
		}

		!templateID && (templateID = ("t" + UID++));

		// if(templateID && _cacheCompiled[templateID])
		// 	return _cacheCompiled[templateID];

		if(_cacheCompiledByTpl[templateString])
			return _cacheCompiledByTpl[templateString];

		if( DEBUG ) {
			(console.groupCollapsed || console.group)( "tpl: " + templateID );
		}

		var compiled = compileTemplateString(templateString, templateID, isPartial);

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


    // "_experimental.js"

    
    if( DEBUG ) {

    	
    	var _cacheParsingDebug = {};
    	var _cacheOriginals = {};
    	
    	function getOriginalLine( code, name, start ) {
    		var arr = _cacheOriginals[name], result;
    		arr.forEach(function(line, i){
    			if( !start || (i >= start )) {
    				if( line.indexOf(code) > -1 ) {
    					result = i;
    					return false;
    				}
    			}
    		});
    		return result;
    	}
    	
    	function getOriginalLineFromParsedIndex( parsed, name ) {
    		var result, mark = false;
    		_cacheParsingDebug[name].forEach(function(ln){
    			if(ln.parsed === parsed ) {
    				mark = 1;
    				result = ln.original;
    			} else if(mark) {
    				return false;
    			}
    		});
    		return result;
    	}
    	
    	Wzhik["debug"] = function( templateID, originalLineNumber, err){
    		console.error([
    				"Error in template: " + templateID,
    				"Line number: " + originalLineNumber,
    				"Line content: "+ (_cacheOriginals[templateID][originalLineNumber] || "").trim(),
    				// "Token ID: " + (compiledLinesIndex-2),
    				"Reference: " + err.message
    		].join("\n"));
    	}
    	
    	
    	function createLinesMap( templateString, name ) {
    		if(_cacheParsingDebug[name]) {
    			return _cacheParsingDebug[name];
    		}
    		var originalLines  = templateString.split(/\n/);
    		var originalLinesCount = originalLines.length;
    		_cacheOriginals[name] = originalLines;
    	
    		var tokens = templateString.split( CLOSE_TAG );
    	
    		// for(var tokenIndex = 0, tokensLength = tokens.length; tokenIndex < tokensLength; tokenIndex++){
    	}
    	
    	
    	function getlines(){}
    	
    	
    	function wrapWithTryCatch(){}
    	
    	
    	function log(){}
    	
    	
    	function getInfo( templateID ){}
    	
    	
    	function UID(){}
    	
    	
    	Wzhik["displayError"] = function displayError(){}
    	
    	Wzhik["displayWarning"] = function displayWarning(){}
    	
    	Wzhik["displayInfo"] = function displayInfo(){}
    	
    	
    	if(!root['console']) {
    		console = root['console'] = {};
    	}
    	
    	(["log", "group", "groupCollapsed", "groupEnd", "warn", "error", "info"]).forEach(function( fn ){
    		!console[fn] && (console[fn] = function(){});
    	});
    }


    root[WZHIK_NAME] = Wzhik;
    
    // For tests usage only
    root[WZHIK_NAME]['_name'] = WZHIK_NAME;

    if( typeof exports !== 'undefined' ) {
    	module['exports'] = Wzhik;
    } else {
    	root[WZHIK_NAME] = Wzhik;
    }

}( this );