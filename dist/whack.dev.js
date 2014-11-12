


// COMPILATION FLAGS
// ------------------------------------------------------------------------------------------------

// Debug information
// error detection
// formatted template sources etc.
/** @define {boolean} */	var DEBUG = false;

// Global variable name
/** @define {string} */		var WHACK_NAME = "Whack";

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

	// Simple increment ID for each tpl/patrial etc.
	var UID = 0;

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


	// It is possible to use Whack in Underscore's style
	// E.g.  {someProp: 2} => someProp
	// It is not recommended to use this setting
	// http://www.2ality.com/2011/06/with-statement.html
	if( USE_WITH ) {

		// @todo Try to replace "With" with real(?) local vars
		CODE_FIRST = 
			(IGNORE_NULLS ? "var _v=" + WHACK_NAME + ".v," : "var")
			+ OUTPUT_VAR + "=" + (DEBUG ? "[]" : "''")
			+ ";with(" + INPUT_VAR + "){";

		CODE_LAST  = "} " + CODE_LAST;

	} else {

		CODE_FIRST = 
			(IGNORE_NULLS ? "var _v=" + WHACK_NAME + ".v," : "var")
			+ OUTPUT_VAR + "=" + (DEBUG ? "[]" : "''");
	}


	// 
	if( DEBUG ) {
		CODE_FIRST = "try{" + CODE_FIRST;
		CODE_LAST = (USE_WITH ? "}" : "") + "}catch(e){console.error(e.message);};" + "return " + OUTPUT_VAR + (DEBUG ? ".join('')" : "");
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
	
	
	
		if(SUPPORT_OLD_BROWSERS && !Object.observe) {
			
		}
	
	
	
		var parsemap = {};
	
		if( SUPPORT_SHORTCODES ) {
	
			parsemap = {
	
				"end" : function(){
					return {operator: KEY_JS, _code: '}'}
				},
	
				"else" : function(){
					return {operator: KEY_JS, _code: '}else{'}
				},
	
				"elseif" : function( code ){
					return parsemap["if"]("}else " + code.replace("else", ""))
				},
	
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
					return {
						operator : KEY_FOR,
						_code : [vals.$1, vals.$2]
					}
				}
			}
	
			// alias
			parsemap["forEach"] = parsemap["each"];
		}
	
	
		if( SUPPORT_PARTIALS ) {
			parsemap["include"] = function(code) {
	
				var r = regexOP.test(code) && _RegExp.$1;
	
				if(AUTOCOMPILE && !_cacheCompiled[r]){
	
					Whack(r);
	
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
	
		
	
	
	
		if( SUPPORT_FILTERS ) {
	
			var isChrome = root['chrome'];
	
			var _filters = {},
				doc = root.document;
	
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
	
			Whack['e'] = _filters["escapeHTML"] = function( code ) {
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
	
	
			Whack['f'] = _filters;
	    	
	    	Whack['addFilter'] = function(name, fn){
	    		_filters[name] = fn;
	    		return Whack
	    	}
	
	
		}
	
	
	
	
		if( IGNORE_NULLS ) {
	    	Whack['v'] = function( o, variable, templateID, lineNumber ){
	    		if( DEBUG ) {
	    			if( o === undefined ) {
	    				console.warn("Undefined value: ", variable, '===', o, "in template", "#" +templateID, "at line", lineNumber);
	    			}
	
	    			return (typeof o === "number" || o) ? o : "";
	    		} else {
	    			return (typeof o === "number" || o) ? o : "";
	    		}
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
		function parseTemplateString( templateString, name){
	
			var parsedLinesIndex;
			var parsedLines;
			var tokens = templateString.split( CLOSE_TAG );
	
			// @todo debug real unclosed tags
			// if ( DEBUG && tokens.length != templateString.split( OPEN_TAG ) ) {
			// 	console.error( "Somewhere over the rainbow" )
			// }
	
			var extended;
			var parentID;
	
			// If Whack supports extend, it should be in the first line
			if( SUPPORT_EXTENDS && (parentID = regexEXTEND.test(tokens[0]) && _RegExp.$1)) {
	
				// In autocompile mode make sure that parentID is exist
				if(AUTOCOMPILE && !_cacheParsing[parentID]){
					// Try to compile parent from DOM useing ID selector
					Whack( parentID );
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
								if( Whack['f'][f] ) {
									code = code.replace("|" + f + (param ? ("("+param+")") : ""), "");
									// var __code = code;
									code = WHACK_NAME + ".f." + f + "(" + code + (param && "," + param) + ")";
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
			Whack.parseTemplateString = parseTemplateString;
		}
	
		function compileTemplateString(str, name ){
	
			var parsedLines = parseTemplateString(str, name);
			var parsedLinesIndex = parsedLines.len;
			var compiledLines = Array(parsedLinesIndex);
			var compiledLinesIndex = 0;
			var lastOperator,line, operator;
	
			for(var i = -1, l = parsedLinesIndex; ++i < l;){
	
				line = parsedLines[i];
				operator = line.operator;
	
				if( lastOperator !== operator || operator === KEY_JS)
					compiledLines[compiledLinesIndex++] = ';';
	
				var v = line._code;
	
				// Plain javascript
				if(operator === KEY_JS){
	
					compiledLines[compiledLinesIndex++] = v;
	
				// Each / foreach
				} else if(operator === KEY_FOR){
	
					var item = v[1] || "item",
						iter = "i" + UID,
						len  = "l" + UID,
						arr  = "a" + UID;
	
					UID++;
	
					// @todo object?
					// compiledLines[compiledLinesIndex++] = OUTPUT_VAR + '.push(' + '"<!--' + v[0] + '-->");';
					compiledLines[compiledLinesIndex++] = (
						'for(var '+ iter + '=0,' + item + ',' + arr + '=' + v[0] + ',' + len + '=' + arr + '.length;' +
							iter + '<' + len + ';' + iter + '++){' + item + '=' + arr + '[' + iter + '];' + 
							"var " + item + "_isFirst=(" + iter + "==0)," + 
									 item + "_isLast=(" + iter + "=="+len+"-1)," + 
									 item + "_isEven=(" + iter + "%2)"
					);
	
				// Block operator
				} else if( SUPPORT_EXTENDS && operator === KEY_BLOCK ){
	
					compiledLines[compiledLinesIndex++] = _cachePartials[v];
	
				} else {
	
					if( IGNORE_NULLS ) {
	
						if ( DEBUG ) {
							var variable = v;
	
							if( SUPPORT_EXPERIMENTAL && v.charAt(0) !== "'" ) {
								// @todo ?
								v = v.trim();
								var variableComment = '"<!--' + v + '-->"';
								variable = variableComment + "+" + v;
							}
	
							var tplname = "'" + name + "'";
							var variableString = (line._code || "");
	
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
	function Whack(templateString, templateID){

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


    // "_experimental.js"

    root[WHACK_NAME] = Whack;
    
    // For tests usage only
    root[WHACK_NAME]['_name'] = WHACK_NAME;

    if (server) {
        module.exports = Whack;
    } else {
        if (typeof define === 'function') {
            define(WHACK_NAME, [], function () {
            	return Whack; 
            });
        } else {
        	root[WHACK_NAME] = Whack;
        }
    }


    if( DEBUG ) {

		if(!root['console']) {
			console = root['console'] = {};
		}
		
		(["log", "group", "groupEnd", "warn", "error", "info"]).forEach(function( fn ){
			!console[fn] && (console[fn] = function(){});
		});


    }

}( this );